// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ILendingAdapter {
    function deposit(address token, uint256 amount) external returns (uint256 shares);
    function withdraw(address token, uint256 amount, address to) external returns (uint256 withdrawn);
    function totalUnderlying(address token) external view returns (uint256);
}

contract MockLendingAdapter is ILendingAdapter {
    mapping(address => uint256) public deposited;

    function deposit(address token, uint256 amount) external returns (uint256 shares) {
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        deposited[token] += amount;
        return amount;
    }

    function withdraw(address token, uint256 amount, address to) external returns (uint256 withdrawn) {
        uint256 avail = deposited[token];
        if (amount > avail) amount = avail;
        deposited[token] -= amount;
        IERC20(token).transfer(to, amount);
        return amount;
    }

    function totalUnderlying(address token) external view returns (uint256) { return deposited[token]; }
}
