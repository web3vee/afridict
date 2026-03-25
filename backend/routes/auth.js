const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { generateToken, protect } = require("../middleware/auth");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password, username, country, currency, language, referralCode } = req.body;

    if (!email || !password || !username || !country) {
      return res.status(400).json({ error: "Email, password, username, and country are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ error: "Email or username already taken" });
    }

    const userData = { email, password, username, country, currency, language };

    // Handle referral
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) userData.referredBy = referrer._id;
    }

    const user = await User.create(userData);
    const token = generateToken(user._id);

    res.status(201).json({ token, user: user.toPublicJSON() });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Account suspended" });
    }

    const token = generateToken(user._id);
    res.json({ token, user: user.toPublicJSON() });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});

// POST /api/auth/wallet-link
router.post("/wallet-link", protect, async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) return res.status(400).json({ error: "Wallet address required" });

    const existing = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (existing && existing._id.toString() !== req.user._id.toString()) {
      return res.status(409).json({ error: "Wallet already linked to another account" });
    }

    req.user.walletAddress = walletAddress.toLowerCase();
    await req.user.save();

    res.json({ message: "Wallet linked", user: req.user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ error: "Failed to link wallet" });
  }
});

// POST /api/auth/kyc/submit
router.post("/kyc/submit", protect, async (req, res) => {
  try {
    const { documentType, documentHash } = req.body;
    if (!documentType || !documentHash) {
      return res.status(400).json({ error: "Document type and hash required" });
    }

    req.user.kyc = {
      status: "pending",
      submittedAt: new Date(),
      documentType,
      documentHash,
    };
    await req.user.save();

    // In production: trigger KYC provider webhook (e.g., Smile ID, Jumio)
    res.json({ message: "KYC submitted for review", status: "pending" });
  } catch (err) {
    res.status(500).json({ error: "KYC submission failed" });
  }
});

module.exports = router;
