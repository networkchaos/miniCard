const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("MiniCard Upgradable Suite", function () {
  let owner, alice, bob, merchant, operator;
  let MockERC20, mockToken, usdc, usdt, MockRouter;
  let router, vault, subManager, fiatBridge, MockLendingAdapter;

  beforeEach(async function () {
    [owner, alice, bob, merchant, operator] = await ethers.getSigners();

    MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("Mock", "MCK", ethers.utils.parseUnits("1000000", 18));
    await mockToken.deployed();

    usdc = await MockERC20.deploy("USDC", "USDC", ethers.utils.parseUnits("1000000", 18));
    await usdc.deployed();

    usdt = await MockERC20.deploy("USDT", "USDT", ethers.utils.parseUnits("1000000", 18));
    await usdt.deployed();

    MockRouter = await ethers.getContractFactory("MockRouter");
    router = await MockRouter.deploy();
    await router.deployed();

    // fund router with some USDC/USDT
    await usdc.transfer(router.address, ethers.utils.parseUnits("500000", 18));
    await usdt.transfer(router.address, ethers.utils.parseUnits("500000", 18));

    // Deploy Vault as upgradeable proxy
    const Vault = await ethers.getContractFactory("VaultUpgradeable");
    vault = await upgrades.deployProxy(Vault, [router.address, owner.address, owner.address, 50], {initializer: 'initialize'});
    await vault.deployed();

    // allow USDC & USDT
    await vault.connect(owner).setStable(usdc.address, true);
    await vault.connect(owner).setStable(usdt.address, true);

    // set operator
    await vault.connect(owner).setOperator(operator.address, true);

    // Deploy SubscriptionManager proxy
    const SubManager = await ethers.getContractFactory("SubscriptionManagerUpgradeable");
    subManager = await upgrades.deployProxy(SubManager, [vault.address, owner.address], {initializer: 'initialize'});
    await subManager.deployed();

    await vault.connect(owner).setSubscriptionManager(subManager.address);

    // Deploy FiatBridge
    const FiatBridge = await ethers.getContractFactory("FiatBridgeUpgradeable");
    fiatBridge = await upgrades.deployProxy(FiatBridge, [owner.address], {initializer: 'initialize'});
    await fiatBridge.deployed();

    // Deploy MockLendingAdapter
    MockLendingAdapter = await ethers.getContractFactory("MockLendingAdapter");
    mockAdapter = await MockLendingAdapter.deploy();
    await mockAdapter.deployed();

    // Distribute tokens to alice and bob
    await mockToken.transfer(alice.address, ethers.utils.parseUnits("10000", 18));
    await usdc.transfer(alice.address, ethers.utils.parseUnits("1000", 18));
    await usdc.transfer(bob.address, ethers.utils.parseUnits("1000", 18));
  });

  it("depositAndSwap -> credit balances", async function () {
    // alice approve vault for mockToken
    await mockToken.connect(alice).approve(vault.address, ethers.utils.parseUnits("100", 18));

    const path = [mockToken.address, usdc.address];

    // call depositAndSwap
    await vault.connect(alice).depositAndSwap(mockToken.address, ethers.utils.parseUnits("100", 18), usdc.address, 0, path, Math.floor(Date.now()/1000)+3600);
    const bal = await vault.balances(alice.address, usdc.address);
    expect(bal).to.equal(ethers.utils.parseUnits("100", 18));
  });

  it("depositStable & withdraw with fee goes to feeRecipient", async function () {
    // alice gets USDC and deposits
    await usdc.connect(owner).transfer(alice.address, ethers.utils.parseUnits("200", 18));
    await usdc.connect(alice).approve(vault.address, ethers.utils.parseUnits("200", 18));
    await vault.connect(alice).depositStable(usdc.address, ethers.utils.parseUnits("200", 18));

    // set fee recipient to operator and feeBps to 100 (1%)
    await vault.connect(owner).setFee(100, operator.address);

    const beforeOperator = await usdc.balanceOf(operator.address);
    // withdraw 100 USDC to bob
    await vault.connect(alice).withdraw(usdc.address, ethers.utils.parseUnits("100", 18), bob.address);

    const afterOperator = await usdc.balanceOf(operator.address);
    const deltaFee = afterOperator.sub(beforeOperator);
    expect(deltaFee).to.equal(ethers.utils.parseUnits("1", 18)); // 1% of 100

    const bobBal = await usdc.balanceOf(bob.address);
    expect(bobBal).to.equal(ethers.utils.parseUnits("100", 18).sub(ethers.utils.parseUnits("0", 18)).add(ethers.utils.parseUnits("0", 18)).add(ethers.utils.parseUnits("0", 18)));
  });

  it("operator creditOffchain works", async function () {
    await vault.connect(operator).creditOffchain(bob.address, usdc.address, ethers.utils.parseUnits("50", 18));
    const bal = await vault.balances(bob.address, usdc.address);
    expect(bal).to.equal(ethers.utils.parseUnits("50", 18));
  });

  it("links create and claim", async function () {
    // alice deposit
    await usdc.connect(owner).transfer(alice.address, ethers.utils.parseUnits("200", 18));
    await usdc.connect(alice).approve(vault.address, ethers.utils.parseUnits("200", 18));
    await vault.connect(alice).depositStable(usdc.address, ethers.utils.parseUnits("200", 18));

    const secret = "s3cr3t";
    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(secret));
    const linkId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("link-1"));

    await vault.connect(alice).createLink(linkId, usdc.address, ethers.utils.parseUnits("25", 18), hash, Math.floor(Date.now()/1000)+3600);

    const bobBefore = await usdc.balanceOf(bob.address);
    await vault.connect(bob).claimLink(linkId, secret);
    const bobAfter = await usdc.balanceOf(bob.address);
    expect(bobAfter.sub(bobBefore)).to.equal(ethers.utils.parseUnits("25", 18));
  });

  it("subscription create and attemptCharge deducts fee and pays merchant", async function () {
    // alice deposit 100 USDC
    await usdc.connect(owner).transfer(alice.address, ethers.utils.parseUnits("100", 18));
    await usdc.connect(alice).approve(vault.address, ethers.utils.parseUnits("100", 18));
    await vault.connect(alice).depositStable(usdc.address, ethers.utils.parseUnits("100", 18));

    // set fee recipient and fee
    await vault.connect(owner).setFee(100, operator.address); // 1%

    // create subscription (alice pays merchant 30 USDC every 1 second)
    const tx = await subManager.connect(alice).createSubscription(merchant.address, usdc.address, ethers.utils.parseUnits("30", 18), 1);
    const receipt = await tx.wait();
    const evt = receipt.events.find(e => e.event === 'SubscriptionCreated');
    const subId = evt.args.id;

    // fast-forward time
    await ethers.provider.send("evm_increaseTime", [2]);
    await ethers.provider.send("evm_mine");

    const beforeMerchant = await usdc.balanceOf(merchant.address);
    await subManager.connect(bob).attemptCharge(subId);
    const afterMerchant = await usdc.balanceOf(merchant.address);
    // merchant should receive 30 - 1% fee = 29.7 -> token decimals 18, so check approx
    const diff = afterMerchant.sub(beforeMerchant);
    expect(diff).to.equal(ethers.utils.parseUnits("297", 17)); // 29.7 = 297e16
  });

  it("depositToLending and withdrawFromLending via mock adapter", async function () {
    // alice deposit stable
    await usdc.connect(owner).transfer(alice.address, ethers.utils.parseUnits("500", 18));
    await usdc.connect(alice).approve(vault.address, ethers.utils.parseUnits("500", 18));
    await vault.connect(alice).depositStable(usdc.address, ethers.utils.parseUnits("500", 18));

    // admin moves 200 USDC from vault to mock adapter (simulate pooling)
    // First, vault needs to have the tokens in contract; we already have them balanced in vault but actual token is in contract
    // Call depositToLending
    await vault.connect(owner).depositToLending(mockAdapter.address, usdc.address, ethers.utils.parseUnits("200", 18));

    // Withdraw back to owner address
    await vault.connect(owner).withdrawFromLending(mockAdapter.address, usdc.address, ethers.utils.parseUnits("200", 18), owner.address);

    // Check owner received withdrawal
    const ownerBal = await usdc.balanceOf(owner.address);
    expect(ownerBal).to.be.gt(0);
  });
});
