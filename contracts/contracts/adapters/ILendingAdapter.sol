// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


interface ILendingAdapter {
// deposit `amount` of `token` (already approved) into lending market, return interest-bearing token amount or shares
function deposit(address token, uint256 amount) external returns (uint256 shares);


// withdraw underlying `amount` from lending market to `to`, returns actual withdrawn
function withdraw(address token, uint256 amount, address to) external returns (uint256 withdrawn);


// view accrued yield (optional)
function totalUnderlying(address token) external view returns (uint256);
}