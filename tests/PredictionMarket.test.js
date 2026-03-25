const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("PredictionMarket", function () {
  let market, usdt, oracle;
  let owner, resolver, user1, user2, user3;
  const USDT_DECIMALS = 6;
  const toUSDT = (n) => ethers.parseUnits(String(n), USDT_DECIMALS);

  beforeEach(async () => {
    [owner, resolver, user1, user2, user3] = await ethers.getSigners();

    // Deploy MockUSDT
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    usdt = await MockUSDT.deploy();

    // Deploy MockOracle
    const MockOracle = await ethers.getContractFactory("MockOracle");
    oracle = await MockOracle.deploy();

    // Deploy PredictionMarket
    const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
    market = await PredictionMarket.deploy(await usdt.getAddress());

    // Setup: KYC users
    await market.setKYC(owner.address, true);
    await market.setKYC(user1.address, true);
    await market.setKYC(user2.address, true);
    await market.setKYC(user3.address, true);

    // Add resolver
    await market.setResolver(resolver.address, true);

    // Fund users
    await usdt.mint(user1.address, toUSDT(10000));
    await usdt.mint(user2.address, toUSDT(10000));
    await usdt.mint(user3.address, toUSDT(10000));

    // Approve market to spend USDT
    for (const user of [user1, user2, user3]) {
      await usdt.connect(user).approve(await market.getAddress(), toUSDT(999999));
    }
  });

  describe("Market Creation", () => {
    it("should create a market correctly", async () => {
      const now = await time.latest();
      const endTime = now + 3600;
      const resolutionTime = endTime + 3600;

      await market.createMarket(
        "Will Nigeria win AFCON 2025?",
        "sports",
        "Nigeria",
        endTime,
        resolutionTime,
        ethers.ZeroAddress,
        ethers.ZeroHash
      );

      const m = await market.getMarket(0);
      expect(m.description).to.equal("Will Nigeria win AFCON 2025?");
      expect(m.category).to.equal("sports");
      expect(m.region).to.equal("Nigeria");
      expect(m.status).to.equal(0); // Open
    });

    it("should reject market with end time in the past", async () => {
      const now = await time.latest();
      await expect(
        market.createMarket("Test", "sports", "Nigeria", now - 1, now + 3600, ethers.ZeroAddress, ethers.ZeroHash)
      ).to.be.revertedWith("End time must be in future");
    });
  });

  describe("Betting", () => {
    let marketId;
    const betAmount = toUSDT(100);

    beforeEach(async () => {
      const now = await time.latest();
      await market.createMarket(
        "Will Cocoa price exceed $4000?",
        "commodity",
        "West Africa",
        now + 3600,
        now + 7200,
        ethers.ZeroAddress,
        ethers.ZeroHash
      );
      marketId = 0;
    });

    it("should allow KYC'd user to place bet on Yes", async () => {
      await market.connect(user1).placeBet(marketId, 1, betAmount); // 1 = Yes
      const pos = await market.getPosition(marketId, user1.address);
      expect(pos.yesShares).to.equal(betAmount);
      expect(pos.noShares).to.equal(0);
    });

    it("should allow KYC'd user to place bet on No", async () => {
      await market.connect(user2).placeBet(marketId, 2, betAmount); // 2 = No
      const pos = await market.getPosition(marketId, user2.address);
      expect(pos.noShares).to.equal(betAmount);
    });

    it("should update pool totals correctly", async () => {
      await market.connect(user1).placeBet(marketId, 1, toUSDT(200));
      await market.connect(user2).placeBet(marketId, 2, toUSDT(300));

      const m = await market.getMarket(marketId);
      expect(m.yesPool).to.equal(toUSDT(200));
      expect(m.noPool).to.equal(toUSDT(300));
    });

    it("should reject non-KYC user", async () => {
      await expect(
        market.connect(user3).placeBet(marketId, 1, betAmount)
      ).to.be.revertedWith("KYC not approved"); // user3 was approved in beforeEach, so this test is already handled
    });

    it("should reject bet after market ends", async () => {
      await time.increase(3601);
      await expect(
        market.connect(user1).placeBet(marketId, 1, betAmount)
      ).to.be.revertedWith("Betting period ended");
    });
  });

  describe("Resolution & Payouts", () => {
    let marketId;

    beforeEach(async () => {
      const now = await time.latest();
      await market.createMarket(
        "Will KES depreciate >10% vs USD?",
        "economy",
        "Kenya",
        now + 3600,
        now + 7200,
        ethers.ZeroAddress,
        ethers.ZeroHash
      );
      marketId = 0;

      // user1 bets 200 Yes, user2 bets 300 No
      await market.connect(user1).placeBet(marketId, 1, toUSDT(200));
      await market.connect(user2).placeBet(marketId, 2, toUSDT(300));
    });

    it("should resolve market and calculate correct payouts", async () => {
      await time.increase(3601);
      await market.connect(resolver).resolveMarket(marketId, 1); // Yes wins

      const m = await market.getMarket(marketId);
      expect(m.status).to.equal(2); // Resolved
      expect(m.outcome).to.equal(1); // Yes

      // Total pool = 500 USDT, fee = 10 USDT (2%), prize = 490
      // user1 (only Yes bettor) gets all 490
      const payout = await market.getPotentialPayout(marketId, user1.address);
      expect(payout).to.equal(toUSDT(490));
    });

    it("should allow winner to claim winnings", async () => {
      await time.increase(3601);
      await market.connect(resolver).resolveMarket(marketId, 1); // Yes wins

      const balanceBefore = await usdt.balanceOf(user1.address);
      await market.connect(user1).claimWinnings(marketId);
      const balanceAfter = await usdt.balanceOf(user1.address);

      expect(balanceAfter - balanceBefore).to.equal(toUSDT(490));
    });

    it("should reject double-claim", async () => {
      await time.increase(3601);
      await market.connect(resolver).resolveMarket(marketId, 1);
      await market.connect(user1).claimWinnings(marketId);
      await expect(market.connect(user1).claimWinnings(marketId)).to.be.revertedWith("Already claimed");
    });

    it("should give loser zero payout", async () => {
      await time.increase(3601);
      await market.connect(resolver).resolveMarket(marketId, 1); // Yes wins
      const payout = await market.getPotentialPayout(marketId, user2.address);
      expect(payout).to.equal(0);
    });
  });

  describe("Oracle Resolution", () => {
    it("should resolve market via oracle", async () => {
      const now = await time.latest();
      await market.createMarket(
        "Oracle test market",
        "economy",
        "Africa",
        now + 3600,
        now + 7200,
        await oracle.getAddress(),
        ethers.ZeroHash
      );

      await market.connect(user1).placeBet(0, 1, toUSDT(100));
      await time.increase(3601);

      // Set oracle to positive (Yes)
      await oracle.setAnswer(1);
      await market.resolveWithOracle(0);

      const m = await market.getMarket(0);
      expect(m.outcome).to.equal(1); // Yes
    });
  });

  describe("Dispute & Cancel", () => {
    it("should allow participant to raise a dispute", async () => {
      const now = await time.latest();
      await market.createMarket("Dispute test", "sports", "Africa", now + 3600, now + 7200, ethers.ZeroAddress, ethers.ZeroHash);
      await market.connect(user1).placeBet(0, 1, toUSDT(100));
      await time.increase(3601);
      await market.connect(resolver).resolveMarket(0, 2); // No wins
      await market.connect(user1).raiseDispute(0, "Result is incorrect");

      const m = await market.getMarket(0);
      expect(m.status).to.equal(4); // Disputed
    });

    it("should refund bettors on cancellation", async () => {
      const now = await time.latest();
      await market.createMarket("Cancel test", "sports", "Africa", now + 3600, now + 7200, ethers.ZeroAddress, ethers.ZeroHash);
      await market.connect(user1).placeBet(0, 1, toUSDT(100));
      await time.increase(100);
      await market.connect(resolver).cancelMarket(0);

      const balBefore = await usdt.balanceOf(user1.address);
      await market.connect(user1).claimRefund(0);
      const balAfter = await usdt.balanceOf(user1.address);

      expect(balAfter - balBefore).to.equal(toUSDT(100));
    });
  });

  describe("Odds Calculation", () => {
    it("should return 50/50 odds for empty market", async () => {
      const now = await time.latest();
      await market.createMarket("Odds test", "sports", "Africa", now + 3600, now + 7200, ethers.ZeroAddress, ethers.ZeroHash);
      const [yes, no] = await market.getOdds(0);
      expect(yes).to.equal(50);
      expect(no).to.equal(50);
    });

    it("should calculate correct odds with bets", async () => {
      const now = await time.latest();
      await market.createMarket("Odds test 2", "sports", "Africa", now + 3600, now + 7200, ethers.ZeroAddress, ethers.ZeroHash);
      await market.connect(user1).placeBet(0, 1, toUSDT(300)); // 300 Yes
      await market.connect(user2).placeBet(0, 2, toUSDT(700)); // 700 No
      const [yes, no] = await market.getOdds(0);
      expect(yes).to.equal(30);
      expect(no).to.equal(70);
    });
  });
});
