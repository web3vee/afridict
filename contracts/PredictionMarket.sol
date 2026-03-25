// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title AfriPredict PredictionMarket
 * @notice African-focused prediction market on Polygon
 * @dev Supports Yes/No markets, USDT stablecoin, Chainlink oracles
 */
contract PredictionMarket is ReentrancyGuard, Ownable {
    IERC20 public immutable usdt;

    uint256 public constant FEE_PERCENT = 2; // 2% platform fee
    uint256 public constant PRECISION = 1e18;

    enum MarketStatus { Open, Closed, Resolved, Disputed, Cancelled }
    enum Outcome { None, Yes, No }

    struct Market {
        uint256 id;
        string description;
        string category;       // "election", "sports", "commodity", "economy"
        string region;         // "Nigeria", "Kenya", "South Africa", etc.
        uint256 endTime;
        uint256 resolutionTime;
        MarketStatus status;
        Outcome outcome;
        uint256 yesPool;       // total USDT bet on Yes
        uint256 noPool;        // total USDT bet on No
        uint256 totalFees;
        address oracle;        // Chainlink oracle address (0x0 = manual)
        address creator;
        bytes32 ipfsMetadata;  // IPFS hash for extra market data
    }

    struct Position {
        uint256 yesShares;
        uint256 noShares;
        bool claimed;
    }

    // Storage
    uint256 public marketCount;
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => Position)) public positions;
    mapping(address => bool) public resolvers;     // authorized resolvers
    mapping(address => bool) public kycApproved;   // KYC whitelist
    mapping(uint256 => address[]) public marketBettors;

    // Events
    event MarketCreated(uint256 indexed marketId, string description, string category, string region, uint256 endTime);
    event BetPlaced(uint256 indexed marketId, address indexed user, Outcome outcome, uint256 amount, uint256 shares);
    event MarketResolved(uint256 indexed marketId, Outcome outcome);
    event WinningsClaimed(uint256 indexed marketId, address indexed user, uint256 amount);
    event MarketCancelled(uint256 indexed marketId);
    event KYCUpdated(address indexed user, bool approved);
    event ResolverUpdated(address indexed resolver, bool approved);
    event DisputeRaised(uint256 indexed marketId, address indexed user, string reason);

    modifier onlyResolver() {
        require(resolvers[msg.sender] || msg.sender == owner(), "Not authorized resolver");
        _;
    }

    modifier onlyKYC() {
        require(kycApproved[msg.sender], "KYC not approved");
        _;
    }

    modifier marketExists(uint256 _marketId) {
        require(_marketId < marketCount, "Market does not exist");
        _;
    }

    constructor(address _usdt) Ownable(msg.sender) {
        usdt = IERC20(_usdt);
        resolvers[msg.sender] = true;
    }

    // ─────────────────────────────────────────────
    //  ADMIN FUNCTIONS
    // ─────────────────────────────────────────────

    function setKYC(address _user, bool _approved) external onlyOwner {
        kycApproved[_user] = _approved;
        emit KYCUpdated(_user, _approved);
    }

    function setResolver(address _resolver, bool _approved) external onlyOwner {
        resolvers[_resolver] = _approved;
        emit ResolverUpdated(_resolver, _approved);
    }

    function withdrawFees(address _to) external onlyOwner {
        uint256 balance = usdt.balanceOf(address(this));
        // Only withdraw accumulated fees, not locked user funds
        uint256 locked = _getTotalLocked();
        uint256 fees = balance > locked ? balance - locked : 0;
        require(fees > 0, "No fees to withdraw");
        usdt.transfer(_to, fees);
    }

    // ─────────────────────────────────────────────
    //  MARKET CREATION
    // ─────────────────────────────────────────────

    /**
     * @notice Create a new prediction market
     * @param _description Human-readable market question
     * @param _category Market category tag
     * @param _region African region/country
     * @param _endTime Unix timestamp when betting closes
     * @param _resolutionTime Unix timestamp for resolution deadline
     * @param _oracle Chainlink oracle address (address(0) for manual)
     * @param _ipfsMetadata IPFS hash for extended metadata
     */
    function createMarket(
        string calldata _description,
        string calldata _category,
        string calldata _region,
        uint256 _endTime,
        uint256 _resolutionTime,
        address _oracle,
        bytes32 _ipfsMetadata
    ) external returns (uint256) {
        require(_endTime > block.timestamp, "End time must be in future");
        require(_resolutionTime > _endTime, "Resolution after end time");
        require(bytes(_description).length > 0, "Empty description");

        uint256 marketId = marketCount++;
        markets[marketId] = Market({
            id: marketId,
            description: _description,
            category: _category,
            region: _region,
            endTime: _endTime,
            resolutionTime: _resolutionTime,
            status: MarketStatus.Open,
            outcome: Outcome.None,
            yesPool: 0,
            noPool: 0,
            totalFees: 0,
            oracle: _oracle,
            creator: msg.sender,
            ipfsMetadata: _ipfsMetadata
        });

        emit MarketCreated(marketId, _description, _category, _region, _endTime);
        return marketId;
    }

    // ─────────────────────────────────────────────
    //  BETTING
    // ─────────────────────────────────────────────

    /**
     * @notice Place a bet on a market outcome
     * @param _marketId Target market
     * @param _outcome Yes (1) or No (2)
     * @param _amount USDT amount (6 decimals on Polygon)
     */
    function placeBet(
        uint256 _marketId,
        Outcome _outcome,
        uint256 _amount
    ) external nonReentrant onlyKYC marketExists(_marketId) {
        Market storage market = markets[_marketId];
        require(market.status == MarketStatus.Open, "Market not open");
        require(block.timestamp < market.endTime, "Betting period ended");
        require(_outcome == Outcome.Yes || _outcome == Outcome.No, "Invalid outcome");
        require(_amount > 0, "Amount must be > 0");

        // Transfer USDT from user
        require(usdt.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        Position storage pos = positions[_marketId][msg.sender];

        // Track first-time bettors for this market
        if (pos.yesShares == 0 && pos.noShares == 0) {
            marketBettors[_marketId].push(msg.sender);
        }

        // Simple share calculation: shares = amount (1:1 at start, AMM in v2)
        uint256 shares = _amount;

        if (_outcome == Outcome.Yes) {
            market.yesPool += _amount;
            pos.yesShares += shares;
        } else {
            market.noPool += _amount;
            pos.noShares += shares;
        }

        emit BetPlaced(_marketId, msg.sender, _outcome, _amount, shares);
    }

    // ─────────────────────────────────────────────
    //  RESOLUTION
    // ─────────────────────────────────────────────

    /**
     * @notice Manually resolve a market (authorized resolvers only)
     */
    function resolveMarket(
        uint256 _marketId,
        Outcome _outcome
    ) external onlyResolver marketExists(_marketId) {
        Market storage market = markets[_marketId];
        require(market.status == MarketStatus.Open || market.status == MarketStatus.Closed, "Cannot resolve");
        require(block.timestamp >= market.endTime, "Market not ended yet");
        require(_outcome == Outcome.Yes || _outcome == Outcome.No, "Invalid outcome");

        market.outcome = _outcome;
        market.status = MarketStatus.Resolved;

        // Calculate and store platform fee
        uint256 totalPool = market.yesPool + market.noPool;
        market.totalFees = (totalPool * FEE_PERCENT) / 100;

        emit MarketResolved(_marketId, _outcome);
    }

    /**
     * @notice Resolve via Chainlink oracle data
     * @dev Oracle must implement AggregatorV3Interface and return > 0 for Yes
     */
    function resolveWithOracle(uint256 _marketId) external marketExists(_marketId) {
        Market storage market = markets[_marketId];
        require(market.oracle != address(0), "No oracle set");
        require(market.status == MarketStatus.Open || market.status == MarketStatus.Closed, "Cannot resolve");
        require(block.timestamp >= market.endTime, "Market not ended yet");

        AggregatorV3Interface oracle = AggregatorV3Interface(market.oracle);
        (, int256 answer,,,) = oracle.latestRoundData();

        // Positive oracle answer = Yes, non-positive = No
        Outcome outcome = answer > 0 ? Outcome.Yes : Outcome.No;
        market.outcome = outcome;
        market.status = MarketStatus.Resolved;

        uint256 totalPool = market.yesPool + market.noPool;
        market.totalFees = (totalPool * FEE_PERCENT) / 100;

        emit MarketResolved(_marketId, outcome);
    }

    /**
     * @notice Cancel a market (refund all bettors)
     */
    function cancelMarket(uint256 _marketId) external onlyResolver marketExists(_marketId) {
        Market storage market = markets[_marketId];
        require(market.status == MarketStatus.Open || market.status == MarketStatus.Closed, "Cannot cancel");
        market.status = MarketStatus.Cancelled;
        emit MarketCancelled(_marketId);
    }

    // ─────────────────────────────────────────────
    //  PAYOUTS
    // ─────────────────────────────────────────────

    /**
     * @notice Claim winnings from a resolved market
     */
    function claimWinnings(uint256 _marketId) external nonReentrant marketExists(_marketId) {
        Market storage market = markets[_marketId];
        require(market.status == MarketStatus.Resolved, "Market not resolved");

        Position storage pos = positions[_marketId][msg.sender];
        require(!pos.claimed, "Already claimed");
        pos.claimed = true;

        uint256 payout = _calculatePayout(_marketId, msg.sender);
        require(payout > 0, "No winnings");

        require(usdt.transfer(msg.sender, payout), "Transfer failed");
        emit WinningsClaimed(_marketId, msg.sender, payout);
    }

    /**
     * @notice Claim refund from a cancelled market
     */
    function claimRefund(uint256 _marketId) external nonReentrant marketExists(_marketId) {
        Market storage market = markets[_marketId];
        require(market.status == MarketStatus.Cancelled, "Market not cancelled");

        Position storage pos = positions[_marketId][msg.sender];
        require(!pos.claimed, "Already claimed");
        pos.claimed = true;

        uint256 refund = pos.yesShares + pos.noShares;
        require(refund > 0, "Nothing to refund");

        require(usdt.transfer(msg.sender, refund), "Transfer failed");
    }

    // ─────────────────────────────────────────────
    //  DISPUTE
    // ─────────────────────────────────────────────

    function raiseDispute(uint256 _marketId, string calldata _reason) external marketExists(_marketId) {
        Market storage market = markets[_marketId];
        require(market.status == MarketStatus.Resolved, "Market not resolved");
        require(
            positions[_marketId][msg.sender].yesShares > 0 ||
            positions[_marketId][msg.sender].noShares > 0,
            "Not a participant"
        );
        market.status = MarketStatus.Disputed;
        emit DisputeRaised(_marketId, msg.sender, _reason);
    }

    // ─────────────────────────────────────────────
    //  VIEW FUNCTIONS
    // ─────────────────────────────────────────────

    function getMarket(uint256 _marketId) external view returns (Market memory) {
        return markets[_marketId];
    }

    function getPosition(uint256 _marketId, address _user) external view returns (Position memory) {
        return positions[_marketId][_user];
    }

    function getMarketBettors(uint256 _marketId) external view returns (address[] memory) {
        return marketBettors[_marketId];
    }

    function getPotentialPayout(uint256 _marketId, address _user) external view returns (uint256) {
        Market storage market = markets[_marketId];
        if (market.status != MarketStatus.Resolved) return 0;
        return _calculatePayout(_marketId, _user);
    }

    function getOdds(uint256 _marketId) external view marketExists(_marketId) returns (uint256 yesOdds, uint256 noOdds) {
        Market storage market = markets[_marketId];
        uint256 total = market.yesPool + market.noPool;
        if (total == 0) return (50, 50);
        yesOdds = (market.yesPool * 100) / total;
        noOdds = 100 - yesOdds;
    }

    function getAllMarkets() external view returns (Market[] memory) {
        Market[] memory all = new Market[](marketCount);
        for (uint256 i = 0; i < marketCount; i++) {
            all[i] = markets[i];
        }
        return all;
    }

    // ─────────────────────────────────────────────
    //  INTERNAL
    // ─────────────────────────────────────────────

    function _calculatePayout(uint256 _marketId, address _user) internal view returns (uint256) {
        Market storage market = markets[_marketId];
        Position storage pos = positions[_marketId][_user];

        uint256 totalPool = market.yesPool + market.noPool;
        uint256 fee = (totalPool * FEE_PERCENT) / 100;
        uint256 prizePool = totalPool - fee;

        uint256 userShares;
        uint256 winningPool;

        if (market.outcome == Outcome.Yes) {
            userShares = pos.yesShares;
            winningPool = market.yesPool;
        } else {
            userShares = pos.noShares;
            winningPool = market.noPool;
        }

        if (winningPool == 0 || userShares == 0) return 0;
        return (userShares * prizePool) / winningPool;
    }

    function _getTotalLocked() internal view returns (uint256) {
        uint256 locked = 0;
        for (uint256 i = 0; i < marketCount; i++) {
            Market storage m = markets[i];
            if (m.status == MarketStatus.Open || m.status == MarketStatus.Closed || m.status == MarketStatus.Disputed) {
                locked += m.yesPool + m.noPool;
            }
        }
        return locked;
    }
}
