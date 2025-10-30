// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/IMoolaV2.sol";
import "../interfaces/ILendingAdapter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MoolaAdapter
 * @dev Adapter for Moola V2 on Celo network
 * @notice This adapter allows the vault to deposit stablecoins into Moola for yield generation
 */
contract MoolaAdapter is ILendingAdapter, Ownable {
    IMoolaV2 public moola;
    address public vault;
    
    // Track deposited amounts per token
    mapping(address => uint256) public deposited;
    
    // Track mToken addresses for each underlying token
    mapping(address => address) public mTokenAddresses;
    
    // Celo Moola V2 address
    address public constant CELO_MOOLA_V2 = 0x970b12522CA9b4054807a2c5B736149b5BE2f2A6;
    
    // Celo stablecoin addresses
    address public constant CELO_USDC = 0xcebA9300F2b948710d2653dD7B07f33A8B32118C;
    address public constant CELO_USDT = 0x48065fbBE25f136C7fBe8d5b44E9B24096aDb6c4;
    
    // mToken addresses on Celo (these would need to be updated with actual addresses)
    address public constant CELO_mUSDC = 0x5B4CF2C120A9702225814E18543ee658c5f8631e;
    address public constant CELO_mUSDT = 0x617f3112bf5397D0467D315cC709EF968D9ba546;

    event Deposit(address indexed token, uint256 amount, uint256 shares);
    event Withdraw(address indexed token, uint256 amount, address to);
    event VaultSet(address indexed vault);

    constructor() {
        moola = IMoolaV2(CELO_MOOLA_V2);
        
        // Set mToken addresses
        mTokenAddresses[CELO_USDC] = CELO_mUSDC;
        mTokenAddresses[CELO_USDT] = CELO_mUSDT;
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
     * @dev Set mToken address for a given underlying token
     * @param token The underlying token address
     * @param mToken The corresponding mToken address
     */
    function setMTokenAddress(address token, address mToken) external onlyOwner {
        mTokenAddresses[token] = mToken;
    }

    /**
     * @dev Deposit tokens into Moola V2
     * @param token The token to deposit
     * @param amount The amount to deposit
     * @return shares The amount of mTokens received
     */
    function deposit(address token, uint256 amount) external override returns (uint256 shares) {
        require(msg.sender == vault, "MoolaAdapter: only vault");
        require(amount > 0, "MoolaAdapter: zero amount");
        require(mTokenAddresses[token] != address(0), "MoolaAdapter: token not supported");

        // Transfer tokens from vault
        IERC20(token).transferFrom(vault, address(this), amount);
        
        // Approve Moola
        IERC20(token).approve(address(moola), amount);
        
        // Supply to Moola
        moola.supply(token, amount);
        
        // Update accounting
        deposited[token] += amount;
        shares = amount; // 1:1 for stablecoins
        
        emit Deposit(token, amount, shares);
        return shares;
    }

    /**
     * @dev Withdraw tokens from Moola V2
     * @param token The token to withdraw
     * @param amount The amount to withdraw
     * @param to The address to send tokens to
     * @return withdrawn The actual amount withdrawn
     */
    function withdraw(address token, uint256 amount, address to) external override returns (uint256 withdrawn) {
        require(msg.sender == vault, "MoolaAdapter: only vault");
        require(amount > 0, "MoolaAdapter: zero amount");
        require(mTokenAddresses[token] != address(0), "MoolaAdapter: token not supported");

        // Withdraw from Moola
        withdrawn = moola.withdraw(token, amount);
        
        // Transfer to recipient
        IERC20(token).transfer(to, withdrawn);
        
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
     * @dev Get the current balance of mTokens for a given underlying token
     * @param token The underlying token address
     * @return The balance of mTokens
     */
    function getMTokenBalance(address token) external view returns (uint256) {
        address mToken = mTokenAddresses[token];
        if (mToken == address(0)) return 0;
        return IERC20(mToken).balanceOf(address(this));
    }

    /**
     * @dev Get the current supply rate for a token
     * @param token The token address
     * @return The current supply rate (in ray)
     */
    function getSupplyRate(address token) external view returns (uint256) {
        return moola.getReserveNormalizedIncome(token);
    }
}
