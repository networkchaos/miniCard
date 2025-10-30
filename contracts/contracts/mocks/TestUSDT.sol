// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestUSDT is ERC20, Ownable {
    constructor() ERC20("Test Tether USD", "TUSDT") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Mint 1,000,000 TUSDT to deployer
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 6; // USDT uses 6 decimals
    }
}
