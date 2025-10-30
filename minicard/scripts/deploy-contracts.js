const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying contracts to Celo network...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy Test Tokens
  console.log("Deploying Test USDT...");
  const TestUSDT = await ethers.getContractFactory("TestUSDT");
  const testUSDT = await TestUSDT.deploy();
  await testUSDT.deployed();
  console.log("Test USDT deployed to:", testUSDT.address);

  console.log("Deploying Test USDC...");
  const TestUSDC = await ethers.getContractFactory("TestUSDC");
  const testUSDC = await TestUSDC.deploy();
  await testUSDC.deployed();
  console.log("Test USDC deployed to:", testUSDC.address);

  // Deploy Adapters
  console.log("Deploying Aave Adapter...");
  const AaveAdapter = await ethers.getContractFactory("AaveAdapter");
  const aaveAdapter = await AaveAdapter.deploy();
  await aaveAdapter.deployed();
  console.log("Aave Adapter deployed to:", aaveAdapter.address);

  console.log("Deploying Moola Adapter...");
  const MoolaAdapter = await ethers.getContractFactory("MoolaAdapter");
  const moolaAdapter = await MoolaAdapter.deploy();
  await moolaAdapter.deployed();
  console.log("Moola Adapter deployed to:", moolaAdapter.address);

  // Deploy Vault
  console.log("Deploying Vault...");
  const VaultUpgradeable = await ethers.getContractFactory("VaultUpgradeable");
  const vault = await VaultUpgradeable.deploy();
  await vault.deployed();
  console.log("Vault deployed to:", vault.address);

  // Deploy Subscription Manager
  console.log("Deploying Subscription Manager...");
  const SubscriptionManagerUpgradeable = await ethers.getContractFactory("SubscriptionManagerUpgradeable");
  const subscriptionManager = await SubscriptionManagerUpgradeable.deploy();
  await subscriptionManager.deployed();
  console.log("Subscription Manager deployed to:", subscriptionManager.address);

  // Deploy Fiat Bridge
  console.log("Deploying Fiat Bridge...");
  const FiatBridgeUpgradeable = await ethers.getContractFactory("FiatBridgeUpgradeable");
  const fiatBridge = await FiatBridgeUpgradeable.deploy();
  await fiatBridge.deployed();
  console.log("Fiat Bridge deployed to:", fiatBridge.address);

  // Initialize contracts
  console.log("Initializing contracts...");
  
  // Initialize Vault
  await vault.initialize(
    "0x0000000000000000000000000000000000000000", // router address (set later)
    deployer.address, // admin
    deployer.address, // fee recipient
    50 // 0.5% fee
  );

  // Initialize Subscription Manager
  await subscriptionManager.initialize(vault.address, deployer.address);

  // Initialize Fiat Bridge
  await fiatBridge.initialize(deployer.address);

  // Set up vault with stablecoins
  await vault.setStable(testUSDT.address, true);
  await vault.setStable(testUSDC.address, true);

  // Set up adapters
  await aaveAdapter.setVault(vault.address);
  await moolaAdapter.setVault(vault.address);

  // Mint test tokens to deployer
  console.log("Minting test tokens...");
  await testUSDT.mint(deployer.address, ethers.utils.parseUnits("1000000", 6)); // 1M USDT
  await testUSDC.mint(deployer.address, ethers.utils.parseUnits("1000000", 6)); // 1M USDC

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("Contract Addresses:");
  console.log("Test USDT:", testUSDT.address);
  console.log("Test USDC:", testUSDC.address);
  console.log("Aave Adapter:", aaveAdapter.address);
  console.log("Moola Adapter:", moolaAdapter.address);
  console.log("Vault:", vault.address);
  console.log("Subscription Manager:", subscriptionManager.address);
  console.log("Fiat Bridge:", fiatBridge.address);

  console.log("\nUpdate your .env.local file with these addresses:");
  console.log(`NEXT_PUBLIC_TEST_USDT_ADDRESS=${testUSDT.address}`);
  console.log(`NEXT_PUBLIC_TEST_USDC_ADDRESS=${testUSDC.address}`);
  console.log(`NEXT_PUBLIC_AAVE_ADAPTER_ADDRESS=${aaveAdapter.address}`);
  console.log(`NEXT_PUBLIC_MOOLA_ADAPTER_ADDRESS=${moolaAdapter.address}`);
  console.log(`NEXT_PUBLIC_VAULT_ADDRESS=${vault.address}`);
  console.log(`NEXT_PUBLIC_SUBSCRIPTION_MANAGER_ADDRESS=${subscriptionManager.address}`);
  console.log(`NEXT_PUBLIC_FIAT_BRIDGE_ADDRESS=${fiatBridge.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
