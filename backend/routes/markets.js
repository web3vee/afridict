const express = require("express");
const router = express.Router();
const Market = require("../models/Market");
const { protect, requireAdmin } = require("../middleware/auth");

// GET /api/markets — list all markets with filters
router.get("/", async (req, res) => {
  try {
    const { category, region, status, featured, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (region) filter.region = new RegExp(region, "i");
    if (status) filter.status = status;
    if (featured === "true") filter.featured = true;
    if (search) filter.description = new RegExp(search, "i");

    const skip = (Number(page) - 1) * Number(limit);
    const [markets, total] = await Promise.all([
      Market.find(filter).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Market.countDocuments(filter),
    ]);

    res.json({
      markets,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch markets" });
  }
});

// GET /api/markets/:id
router.get("/:id", async (req, res) => {
  try {
    const market = await Market.findOne({ contractId: req.params.id });
    if (!market) return res.status(404).json({ error: "Market not found" });
    market.views += 1;
    await market.save();
    res.json(market);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch market" });
  }
});

// GET /api/markets/categories/summary
router.get("/categories/summary", async (req, res) => {
  try {
    const summary = await Market.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 }, totalVolume: { $sum: "$totalVolume" } } },
      { $sort: { count: -1 } },
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

// GET /api/markets/trending/list
router.get("/trending/list", async (req, res) => {
  try {
    const markets = await Market.find({ status: "open" })
      .sort({ totalVolume: -1, participantCount: -1 })
      .limit(10);
    res.json(markets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trending markets" });
  }
});

// POST /api/markets/:id/comment — authenticated
router.post("/:id/comment", protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.length > 500) return res.status(400).json({ error: "Invalid comment" });

    const market = await Market.findOne({ contractId: req.params.id });
    if (!market) return res.status(404).json({ error: "Market not found" });

    market.comments.push({ user: req.user._id, text });
    await market.save();
    res.json({ message: "Comment added" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// PATCH /api/markets/:id — admin only: update metadata
router.patch("/:id", protect, requireAdmin, async (req, res) => {
  try {
    const { featured, status, imageUrl, tags, sources } = req.body;
    const update = {};
    if (featured !== undefined) update.featured = featured;
    if (status) update.status = status;
    if (imageUrl) update.imageUrl = imageUrl;
    if (tags) update.tags = tags;
    if (sources) update.sources = sources;

    const market = await Market.findOneAndUpdate({ contractId: req.params.id }, update, { new: true });
    if (!market) return res.status(404).json({ error: "Market not found" });
    res.json(market);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;
