// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockOracle
 * @notice Simulates a Chainlink AggregatorV3 oracle for testing
 * @dev In production, use real Chainlink price feeds on Polygon
 */
contract MockOracle {
    int256 private _answer;
    address public owner;

    constructor() {
        owner = msg.sender;
        _answer = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // Set answer: >0 resolves Yes, <=0 resolves No
    function setAnswer(int256 answer) external onlyOwner {
        _answer = answer;
    }

    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        return (1, _answer, block.timestamp, block.timestamp, 1);
    }
}
