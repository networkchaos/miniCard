// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

interface ILendingAdapter {
    function deposit(address token, uint256 amount) external returns (uint256 shares);
    function withdraw(address token, uint256 amount, address to) external returns (uint256 withdrawn);
    function totalUnderlying(address token) external view returns (uint256);
}

contract VaultUpgradeable is Initializable, UUPSUpgradeable, AccessControlUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant SUBSCRIPTION_ROLE = keccak256("SUBSCRIPTION_ROLE");

    // supported stable tokens
    mapping(address => bool) public allowedStables;

    // user => stable => balance
    mapping(address => mapping(address => uint256)) public balances;

    // router for swaps
    IUniswapV2Router public router;

    // subscription manager address (also assigned SUBSCRIPTION_ROLE)
    address public subscriptionManager;

    // fees
    uint256 public feeBps; // basis points (i.e., 50 = 0.5%)
    address public feeRecipient;

    // links
    struct Link {
        address creator;
        address stable;
        uint256 amount;
        bytes32 hashSecret;
        uint64 expiry;
        bool claimed;
    }
    mapping(bytes32 => Link) public links;

    event Deposit(address indexed user, address indexed tokenIn, address indexed stable, uint256 amountIn, uint256 amountOut);
    event CreditOffchain(address indexed operator, address indexed user, address indexed stable, uint256 amount);
    event Withdraw(address indexed user, address indexed stable, uint256 amount, address to, uint256 fee);
    event LinkCreated(bytes32 indexed linkId, address indexed creator, address stable, uint256 amount, uint64 expiry);
    event LinkClaimed(bytes32 indexed linkId, address indexed claimer, address stable, uint256 amount);
    event SubscriptionManagerSet(address indexed manager);
    event OperatorSet(address indexed operator, bool enabled);
    event FeeUpdated(uint256 feeBps, address feeRecipient);

    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    function initialize(address _router, address admin, address _feeRecipient, uint256 _feeBps) public initializer {
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        router = IUniswapV2Router(_router);
        feeRecipient = _feeRecipient;
        feeBps = _feeBps;

        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(OPERATOR_ROLE, admin);

        // admin should also be SUBSCRIPTION_ROLE to allow initial setup
        _setupRole(SUBSCRIPTION_ROLE, admin);
    }

    modifier onlyOperator() {
        require(hasRole(OPERATOR_ROLE, msg.sender), "Vault: not operator");
        _;
    }

    modifier onlySubscriptionManager() {
        require(hasRole(SUBSCRIPTION_ROLE, msg.sender), "Vault: only subscription manager");
        _;
    }

    function _authorizeUpgrade(address) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

    // Admin
    function setStable(address stable, bool allowed) external onlyRole(DEFAULT_ADMIN_ROLE) {
        allowedStables[stable] = allowed;
    }

    function setOperator(address op, bool enabled) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (enabled) grantRole(OPERATOR_ROLE, op); else revokeRole(OPERATOR_ROLE, op);
        emit OperatorSet(op, enabled);
    }

    function setSubscriptionManager(address manager) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (subscriptionManager != address(0)) revokeRole(SUBSCRIPTION_ROLE, subscriptionManager);
        subscriptionManager = manager;
        grantRole(SUBSCRIPTION_ROLE, manager);
        emit SubscriptionManagerSet(manager);
    }

    function setRouter(address _router) external onlyRole(DEFAULT_ADMIN_ROLE) {
        router = IUniswapV2Router(_router);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function setFee(uint256 _feeBps, address _feeRecipient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_feeBps <= 1000, "Vault: fee too high"); // max 10%
        feeBps = _feeBps;
        feeRecipient = _feeRecipient;
        emit FeeUpdated(_feeBps, _feeRecipient);
    }

    // deposit + swap
    function depositAndSwap(
        address tokenIn,
        uint256 amountIn,
        address stableOut,
        uint256 amountOutMin,
        address[] calldata path,
        uint256 deadline
    ) external whenNotPaused nonReentrant {
        require(allowedStables[stableOut], "Vault: stable not allowed");
        require(amountIn > 0, "Vault: zero amount");
        require(path.length >= 2, "Vault: path too short");
        require(path[path.length - 1] == stableOut, "Vault: bad path");

        IERC20Upgradeable(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        IERC20Upgradeable(tokenIn).safeIncreaseAllowance(address(router), amountIn);

        uint[] memory amounts = router.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            address(this),
            deadline
        );

        uint256 out = amounts[amounts.length - 1];
        balances[msg.sender][stableOut] += out;

        emit Deposit(msg.sender, tokenIn, stableOut, amountIn, out);
    }

    function depositStable(address stable, uint256 amount) external whenNotPaused nonReentrant {
        require(allowedStables[stable], "Vault: stable not allowed");
        require(amount > 0, "Vault: zero amount");

        IERC20Upgradeable(stable).safeTransferFrom(msg.sender, address(this), amount);
        balances[msg.sender][stable] += amount;
        emit Deposit(msg.sender, stable, stable, amount, amount);
    }

    // credit after off-chain reconciliation. Operator must ensure tokens were deposited or off-chain custody reconciled.
    function creditOffchain(address user, address stable, uint256 amount) external whenNotPaused nonReentrant onlyOperator {
        require(allowedStables[stable], "Vault: stable not allowed");
        require(amount > 0, "Vault: zero amount");
        balances[user][stable] += amount;
        emit CreditOffchain(msg.sender, user, stable, amount);
    }

    // withdraws apply fee and send fee to feeRecipient
    function withdraw(address stable, uint256 amount, address to) external whenNotPaused nonReentrant {
        require(allowedStables[stable], "Vault: stable not allowed");
        require(amount > 0, "Vault: zero amount");
        require(balances[msg.sender][stable] >= amount, "Vault: insufficient balance");

        balances[msg.sender][stable] -= amount;

        uint256 fee = _calculateFee(amount);
        uint256 after = amount - fee;

        if (fee > 0 && feeRecipient != address(0)) {
            IERC20Upgradeable(stable).safeTransfer(feeRecipient, fee);
        }
        IERC20Upgradeable(stable).safeTransfer(to, after);

        emit Withdraw(msg.sender, stable, amount, to, fee);
    }

    function _calculateFee(uint256 amount) internal view returns (uint256) {
        if (feeBps == 0 || feeRecipient == address(0)) return 0;
        return (amount * feeBps) / 10000;
    }

    // Pull for subscriptions (only subscription manager can call)
    function pullForSubscription(address user, address stable, uint256 amount, address to) external whenNotPaused nonReentrant onlySubscriptionManager returns (bool) {
        require(allowedStables[stable], "Vault: stable not allowed");
        require(balances[user][stable] >= amount, "Vault: insufficient balance");

        balances[user][stable] -= amount;
        uint256 fee = _calculateFee(amount);
        uint256 after = amount - fee;

        if (fee > 0 && feeRecipient != address(0)) {
            IERC20Upgradeable(stable).safeTransfer(feeRecipient, fee);
        }
        IERC20Upgradeable(stable).safeTransfer(to, after);
        return true;
    }

    // Links
    function createLink(bytes32 linkId, address stable, uint256 amount, bytes32 hashSecret, uint64 expiry) external whenNotPaused nonReentrant {
        require(linkId != bytes32(0), "Vault: zero linkId");
        require(allowedStables[stable], "Vault: stable not allowed");
        require(amount > 0, "Vault: zero amount");
        require(balances[msg.sender][stable] >= amount, "Vault: insufficient balance");
        require(expiry > block.timestamp, "Vault: expiry must be future");
        require(links[linkId].creator == address(0), "Vault: link exists");

        balances[msg.sender][stable] -= amount;
        links[linkId] = Link({creator: msg.sender, stable: stable, amount: amount, hashSecret: hashSecret, expiry: expiry, claimed: false});
        emit LinkCreated(linkId, msg.sender, stable, amount, expiry);
    }

    function claimLink(bytes32 linkId, string calldata secret) external whenNotPaused nonReentrant {
        Link storage l = links[linkId];
        require(l.creator != address(0), "Vault: link not found");
        require(!l.claimed, "Vault: already claimed");
        require(block.timestamp <= l.expiry, "Vault: expired");
        require(keccak256(abi.encodePacked(secret)) == l.hashSecret, "Vault: invalid secret");

        l.claimed = true;
        IERC20Upgradeable(l.stable).safeTransfer(msg.sender, l.amount);
        emit LinkClaimed(linkId, msg.sender, l.stable, l.amount);
    }

    function reclaimExpiredLink(bytes32 linkId) external whenNotPaused nonReentrant {
        Link storage l = links[linkId];
        require(l.creator != address(0), "Vault: link not found");
        require(!l.claimed, "Vault: already claimed");
        require(block.timestamp > l.expiry, "Vault: not expired");
        require(msg.sender == l.creator, "Vault: not creator");

        l.claimed = true; // mark claimed
        balances[msg.sender][l.stable] += l.amount;
    }

    // Lending adapter helpers (admin-only)
    function depositToLending(address adapter, address stable, uint256 amount) external whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        require(allowedStables[stable], "Vault: stable not allowed");
        require(amount > 0, "Vault: zero amount");

        IERC20Upgradeable(stable).safeIncreaseAllowance(adapter, amount);
        ILendingAdapter(adapter).deposit(stable, amount);
    }

    function withdrawFromLending(address adapter, address stable, uint256 amount, address to) external whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        ILendingAdapter(adapter).withdraw(stable, amount, to);
    }
}
