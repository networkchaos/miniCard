// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/IAaveV3Pool.sol";
import "../interfaces/ILendingAdapter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AaveAdapter
 * @dev Adapter for Aave V3 on Celo network
 * @notice This adapter allows the vault to deposit stablecoins into Aave V3 for yield generation
 */
contract AaveAdapter is ILendingAdapter, Ownable {
    IAaveV3Pool public pool;
    address public vault;
    
    // Track deposited amounts per token
    mapping(address => uint256) public deposited;
    
    // Track aToken addresses for each underlying token
    mapping(address => address) public aTokenAddresses;
    
    // Celo Aave V3 Pool address
    address public constant CELO_AAVE_V3_POOL = 0x794a61358D6845594F94dc1DB02A252b5b4814aD;
    
    // Celo stablecoin addresses
    address public constant CELO_USDC = 0xcebA9300F2b948710d2653dD7B07f33A8B32118C;
    address public constant CELO_USDT = 0x48065fbBE25f136C7fBe8d5b44E9B24096aDb6c4;
    
    // aToken addresses on Celo (these would need to be updated with actual addresses)
    address public constant CELO_aUSDC = 0x625E7708f30cA75bfd92586e17077590C60eb4cD;
    address public constant CELO_aUSDT = 0x6ab707Aca953eDAeFBc4f73E77D55Db73755f8e5;

    event Deposit(address indexed token, uint256 amount, uint256 shares);
    event Withdraw(address indexed token, uint256 amount, address to);
    event VaultSet(address indexed vault);

    constructor() {
        pool = IAaveV3Pool(CELO_AAVE_V3_POOL);
        
        // Set aToken addresses
        aTokenAddresses[CELO_USDC] = CELO_aUSDC;
        aTokenAddresses[CELO_USDT] = CELO_aUSDT;
    }

    /**
     * @dev Set the vault address (only owner)
     * @param _vault The vault contract address
     */
    function setVault(address _vault) external onlyOwner {
        vault = _vault;
        emit VaultSet(_vault);
    }

    /**
     * @dev Set aToken address for a given underlying token
     * @param token The underlying token address
     * @param aToken The corresponding aToken address
     */
    function setATokenAddress(address token, address aToken) external onlyOwner {
        aTokenAddresses[token] = aToken;
    }

    /**
     * @dev Deposit tokens into Aave V3
     * @param token The token to deposit
     * @param amount The amount to deposit
     * @return shares The amount of aTokens received
     */
    function deposit(address token, uint256 amount) external override returns (uint256 shares) {
        require(msg.sender == vault, "AaveAdapter: only vault");
        require(amount > 0, "AaveAdapter: zero amount");
        require(aTokenAddresses[token] != address(0), "AaveAdapter: token not supported");

        // Transfer tokens from vault
        IERC20(token).transferFrom(vault, address(this), amount);
        
        // Approve Aave pool
        IERC20(token).approve(address(pool), amount);
        
        // Supply to Aave
        pool.supply(token, amount, address(this), 0);
        
        // Update accounting
        deposited[token] += amount;
        shares = amount; // 1:1 for stablecoins
        
        emit Deposit(token, amount, shares);
        return shares;
    }

    /**
     * @dev Withdraw tokens from Aave V3
     * @param token The token to withdraw
     * @param amount The amount to withdraw
     * @param to The address to send tokens to
     * @return withdrawn The actual amount withdrawn
     */
    function withdraw(address token, uint256 amount, address to) external override returns (uint256 withdrawn) {
        require(msg.sender == vault, "AaveAdapter: only vault");
        require(amount > 0, "AaveAdapter: zero amount");
        require(aTokenAddresses[token] != address(0), "AaveAdapter: token not supported");

        // Withdraw from Aave
        withdrawn = pool.withdraw(token, amount, to);
        
        // Update accounting
        if (withdrawn > deposited[token]) {
            deposited[token] = 0;
        } else {
            deposited[token] -= withdrawn;
        }
        
        emit Withdraw(token, withdrawn, to);
        return withdrawn;
    }

    /**
     * @dev Get total underlying amount for a token
     * @param token The token address
     * @return The total underlying amount
     */
    function totalUnderlying(address token) external view override returns (uint256) {
        return deposited[token];
    }

    /**
     * @dev Get the current balance of aTokens for a given underlying token
     * @param token The underlying token address
     * @return The balance of aTokens
     */
    function getATokenBalance(address token) external view returns (uint256) {
        address aToken = aTokenAddresses[token];
        if (aToken == address(0)) return 0;
        return IERC20(aToken).balanceOf(address(this));
    }

    /**
     * @dev Get the current supply rate for a token
     * @param token The token address
     * @return The current supply rate (in ray)
     */
    function getSupplyRate(address token) external view returns (uint256) {
        return pool.getReserveNormalizedIncome(token);
    }
}
