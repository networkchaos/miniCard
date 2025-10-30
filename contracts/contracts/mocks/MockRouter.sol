// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./MockERC20.sol";

contract MockRouter {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 /*amountOutMin*/,
        address[] calldata path,
        address to,
        uint256 /*deadline*/
    ) external returns (uint[] memory amounts) {
        require(path.length >= 2, "MockRouter: bad path");
        address tokenIn = path[0];
        address tokenOut = path[path.length - 1];

        // pull tokenIn from caller
        MockERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        // send tokenOut from router to `to` (1:1 for test simplicity)
        MockERC20(tokenOut).transfer(to, amountIn);

        amounts = new uint[](path.length);
        amounts[path.length - 1] = amountIn;
        return amounts;
    }
}
