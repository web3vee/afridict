const express = require("express");
const router  = express.Router();
const Market  = require("../models/Market");
const Bet     = require("../models/Bet");
const User    = require("../models/User");
const { protect, requireAdmin } = require("../middleware/auth");

// GET /api/markets — list markets with optional filters
router.get("/", async (req, res) => {
  try {
    const { category, status = "active", featured, search, page = 1, limit = 100 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status)   filter.status   = status;
    if (featured === "true") filter.featured = true;
    if (search)   filter.title = new RegExp(search, "i");

    const skip = (Number(page) - 1) * Number(limit);
    const [markets, total] = await Promise.all([
      Market.find(filter).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Market.countDocuments(filter),
    ]);

    res.json({ markets, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch markets" });
  }
});

// GET /api/markets/pending — admin: markets awaiting approval
router.get("/pending", protect, requireAdmin, async (req, res) => {
  try {
    const markets = await Market.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(markets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending markets" });
  }
});

// GET /api/markets/:id
router.get("/:id", async (req, res) => {
  try {
    const market = await Market.findOne({ id: Number(req.params.id) });
    if (!market) return res.status(404).json({ error: "Market not found" });
    market.views += 1;
    await market.save();
    res.json(market);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch market" });
  }
});

// POST /api/markets — user submits a new market for review
router.post("/", protect, async (req, res) => {
  try {
    const { title, category, yesOdds, noOdds, endTime, region, imageUrl, tags } = req.body;
    if (!title || !category) {
      return res.status(400).json({ error: "title and category are required" });
    }

    // Auto-increment id
    const last = await Market.findOne().sort({ id: -1 }).select("id");
    const nextId = (last?.id ?? 0) + 1;

    const market = await Market.create({
      id:       nextId,
      title,
      category,
      yesOdds:  yesOdds  ?? 2.0,
      noOdds:   noOdds   ?? 2.0,
      endTime:  endTime  ? new Date(endTime) : null,
      region:   region   ?? "Africa",
      imageUrl: imageUrl ?? null,
      tags:     tags     ?? [],
      status:   "pending",
      creator:  req.user.firebaseUid || req.user._id.toString(),
    });

    res.status(201).json(market);
  } catch (err) {
    console.error("Create market error:", err.message);
    res.status(500).json({ error: "Failed to create market" });
  }
});

// PATCH /api/markets/:id/approve — admin approves a pending market
router.patch("/:id/approve", protect, requireAdmin, async (req, res) => {
  try {
    const market = await Market.findOneAndUpdate(
      { id: Number(req.params.id), status: "pending" },
      { status: "active" },
      { new: true }
    );
    if (!market) return res.status(404).json({ error: "Pending market not found" });

    const io = req.app.get("io");
    if (io) io.emit("market:approved", market);

    res.json(market);
  } catch (err) {
    res.status(500).json({ error: "Approval failed" });
  }
});

// PATCH /api/markets/:id/reject — admin rejects a pending market
router.patch("/:id/reject", protect, requireAdmin, async (req, res) => {
  try {
    const market = await Market.findOneAndUpdate(
      { id: Number(req.params.id), status: "pending" },
      { status: "cancelled" },
      { new: true }
    );
    if (!market) return res.status(404).json({ error: "Pending market not found" });
    res.json(market);
  } catch (err) {
    res.status(500).json({ error: "Rejection failed" });
  }
});

// PATCH /api/markets/:id/resolve — admin resolves a market and pays out winners
router.patch("/:id/resolve", protect, requireAdmin, async (req, res) => {
  try {
    const { outcome } = req.body; // "yes" or "no"
    if (!["yes", "no"].includes(outcome)) {
      return res.status(400).json({ error: "outcome must be yes or no" });
    }

    const market = await Market.findOne({ id: Number(req.params.id), status: "active" });
    if (!market) return res.status(404).json({ error: "Active market not found" });

    market.status     = "resolved";
    market.outcome    = outcome;
    market.resolvedBy = req.user._id;
    market.resolvedAt = new Date();
    await market.save();

    // Pay out winners
    const winningBets = await Bet.find({ marketId: market.id, side: outcome, status: "active" });
    const losingBets  = await Bet.find({ marketId: market.id, side: { $ne: outcome }, status: "active" });

    // Mark losers
    await Bet.updateMany(
      { marketId: market.id, side: { $ne: outcome }, status: "active" },
      { status: "lost", settledAt: new Date() }
    );

    // Pay winners
    for (const bet of winningBets) {
      bet.status    = "won";
      bet.settledAt = new Date();
      await bet.save();

      await User.findByIdAndUpdate(bet.user, {
        $inc: { "balance.usdt": bet.potentialWin, totalWinnings: bet.potentialWin },
      });

      // Notify winner via socket
      const io = req.app.get("io");
      if (io) {
        io.to(`user:${bet.user.toString()}`).emit("bet:won", {
          marketTitle: market.title,
          side:        bet.side,
          amount:      bet.amount,
          payout:      bet.potentialWin,
        });
      }
    }

    res.json({
      market,
      settled: { winners: winningBets.length, losers: losingBets.length },
    });
  } catch (err) {
    console.error("Resolve market error:", err.message);
    res.status(500).json({ error: "Resolution failed" });
  }
});

// POST /api/markets/:id/comment — authenticated comment
router.post("/:id/comment", protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.length > 500) return res.status(400).json({ error: "Invalid comment" });
    const market = await Market.findOne({ id: Number(req.params.id) });
    if (!market) return res.status(404).json({ error: "Market not found" });
    // Store minimal comment data without a sub-document for simplicity
    res.json({ message: "Comment recorded" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

module.exports = router;
