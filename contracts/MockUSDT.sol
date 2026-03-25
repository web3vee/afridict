// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDT
 * @notice Test USDT token — 6 decimals like real USDT
 */
contract MockUSDT is ERC20, Ownable {
    constructor() ERC20("Mock USDT", "USDT") Ownable(msg.sender) {
        _mint(msg.sender, 10_000_000 * 10 ** decimals()); // 10M USDT
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }

    function faucet(uint256 _amount) external {
        require(_amount <= 1000 * 10 ** decimals(), "Max 1000 USDT per faucet");
        _mint(msg.sender, _amount);
    }
}
