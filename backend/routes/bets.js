const express = require("express");
const router  = express.Router();
const { body, param, query, validationResult } = require("express-validator");
const Bet     = require("../models/Bet");
const Market  = require("../models/Market");
const User    = require("../models/User");
const { protect } = require("../middleware/auth");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

/**
 * POST /api/bets
 * Place a bet on a market. Deducts balance, creates bet record, updates market pools.
 */
router.post(
  "/",
  protect,
  [
    body("marketId").isNumeric().withMessage("marketId must be a number"),
    body("side").isIn(["yes", "no"]).withMessage("side must be yes or no"),
    body("amount")
      .isFloat({ min: 0.5, max: 50000 })
      .withMessage("Amount must be between $0.50 and $50,000"),
  ],
  validate,
  async (req, res) => {
  try {
    const { marketId, side, amount } = req.body;

    const user = await User.findById(req.user._id);
    if (user.balance.usdt < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const market = await Market.findOne({ id: marketId, status: "active" });
    if (!market) {
      return res.status(404).json({ error: "Market not found or not active" });
    }

    const odds = side === "yes" ? market.yesOdds : market.noOdds;
    const potentialWin = parseFloat((amount * odds).toFixed(2));

    // Deduct balance
    user.balance.usdt = parseFloat((user.balance.usdt - amount).toFixed(2));
    user.totalBets += 1;
    await user.save();

    // Update market pool
    market.pool = parseFloat((market.pool + amount).toFixed(2));
    if (side === "yes") market.yesPool = parseFloat((market.yesPool + amount).toFixed(2));
    else                market.noPool  = parseFloat((market.noPool  + amount).toFixed(2));
    await market.save();

    const bet = await Bet.create({
      user:         user._id,
      market:       market._id,
      marketId:     market.id,
      marketTitle:  market.title,
      side,
      amount,
      odds,
      potentialWin,
    });

    // Emit real-time pool update to anyone watching this market
    const io = req.app.get("io");
    if (io) {
      io.to(`market:${marketId}`).emit("market:update", {
        marketId,
        pool:    market.pool,
        yesPool: market.yesPool,
        noPool:  market.noPool,
      });
    }

    res.status(201).json({
      bet: {
        id:           bet._id,
        marketId:     bet.marketId,
        marketTitle:  bet.marketTitle,
        side:         bet.side,
        amount:       bet.amount,
        odds:         bet.odds,
        potentialWin: bet.potentialWin,
        status:       bet.status,
        createdAt:    bet.createdAt,
      },
      newBalance: user.balance.usdt,
    });
  } catch (err) {
    console.error("Place bet error:", err.message);
    res.status(500).json({ error: "Failed to place bet" });
  }
});

/**
 * GET /api/bets/my
 * Get the authenticated user's bet history.
 */
router.get("/my", protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [bets, total] = await Promise.all([
      Bet.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Bet.countDocuments(filter),
    ]);

    res.json({
      bets,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bets" });
  }
});

/**
 * GET /api/bets/market/:marketId
 * Get all bets for a market (public — for order book display).
 */
router.get("/market/:marketId", async (req, res) => {
  try {
    const bets = await Bet.find({ marketId: Number(req.params.marketId), status: { $ne: "cancelled" } })
      .select("side amount odds createdAt")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(bets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch market bets" });
  }
});

module.exports = router;
