const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const { protect, requireKYC } = require("../middleware/auth");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  next();
};

// ── API KEYS ─────────────────────────────────────────────────────────
// Flutterwave: dashboard.flutterwave.com → Settings → API Keys
const FLUTTERWAVE_SECRET    = process.env.FLUTTERWAVE_SECRET_KEY;
const FLUTTERWAVE_PUBLIC    = process.env.FLUTTERWAVE_PUBLIC_KEY;
const FLUTTERWAVE_HASH      = process.env.FLUTTERWAVE_WEBHOOK_HASH; // Settings → Webhooks

// Stablesrail / Numo cNGN: app.stablesrail.com → API Keys
const STABLESRAIL_API_KEY   = process.env.STABLESRAIL_API_KEY;
const STABLESRAIL_SECRET    = process.env.STABLESRAIL_WEBHOOK_SECRET;
const STABLESRAIL_BASE_URL  = process.env.STABLESRAIL_BASE_URL || "https://api.stablesrail.com/v1";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// NGN → USDT exchange rate (replace with live FX API in production)
const NGN_RATE = 1600;

/**
 * POST /api/payments/flutterwave/initiate
 * Initiates a fiat deposit via Flutterwave
 * Currencies: NGN, KES, ZAR, GHS
 */
router.post(
  "/flutterwave/initiate",
  protect,
  [
    body("amount").isFloat({ min: 100, max: 10000000 }).withMessage("Minimum deposit is 100"),
    body("currency").isIn(["NGN", "KES", "ZAR", "GHS"]).withMessage("Unsupported currency"),
  ],
  validate,
  async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const txRef = `AFRIPRED-${req.user._id}-${Date.now()}`;

    const payload = {
      tx_ref: txRef,
      amount,
      currency,
      redirect_url: `${FRONTEND_URL}/payment/callback`,
      customer: {
        email: req.user.email,
        name: req.user.username,
      },
      customizations: {
        title: "AfriDict Deposit",
        description: "Fund your AfriDict wallet",
        logo: `${FRONTEND_URL}/logo.png`,
      },
      meta: {
        userId: req.user._id.toString(),
      },
    };

    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      payload,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      paymentLink: response.data.data.link,
      txRef,
    });
  } catch (err) {
    console.error("Flutterwave initiate error:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

/**
 * POST /api/payments/flutterwave/verify
 * Webhook + manual verification for Flutterwave
 */
router.post("/flutterwave/verify", async (req, res) => {
  try {
    const { transaction_id } = req.body;
    if (!transaction_id) return res.status(400).json({ error: "Transaction ID required" });

    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      { headers: { Authorization: `Bearer ${FLUTTERWAVE_SECRET}` } }
    );

    const data = response.data.data;
    if (data.status !== "successful") {
      return res.status(400).json({ error: "Transaction not successful" });
    }

    const meta = data.meta;
    const User = require("../models/User");
    const user = await User.findById(meta.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Convert fiat to USDT (simplified — in prod use real FX rate API)
    const fxRates = { NGN: 1600, KES: 130, ZAR: 18, GHS: 15 };
    const rate = fxRates[data.currency] || 1;
    const usdtAmount = parseFloat((data.amount / rate).toFixed(2));

    user.balance.usdt = parseFloat((user.balance.usdt + usdtAmount).toFixed(2));
    await user.save();

    res.json({ message: "Deposit confirmed", usdtCredited: usdtAmount, newBalance: user.balance.usdt });
  } catch (err) {
    console.error("Flutterwave verify error:", err.message);
    res.status(500).json({ error: "Verification failed" });
  }
});

/**
 * POST /api/payments/paystack/initiate
 * Initiates a fiat deposit via Paystack (NGN primary)
 */
router.post(
  "/paystack/initiate",
  protect,
  [
    body("amount").isInt({ min: 10000, max: 1000000000 }).withMessage("Minimum ₦100 (10000 kobo)"),
  ],
  validate,
  async (req, res) => {
  try {
    const { amount } = req.body; // amount in kobo (NGN)

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: req.user.email,
        amount,
        currency: "NGN",
        reference: `AFRIPRED-PS-${req.user._id}-${Date.now()}`,
        callback_url: `${FRONTEND_URL}/payment/callback`,
        metadata: { userId: req.user._id.toString() },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      authorizationUrl: response.data.data.authorization_url,
      reference: response.data.data.reference,
    });
  } catch (err) {
    console.error("Paystack initiate error:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

/**
 * POST /api/payments/paystack/verify
 */
router.post("/paystack/verify", async (req, res) => {
  try {
    const { reference } = req.body;
    if (!reference) return res.status(400).json({ error: "Reference required" });

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );

    const data = response.data.data;
    if (data.status !== "success") {
      return res.status(400).json({ error: "Transaction not successful" });
    }

    const userId = data.metadata.userId;
    const User = require("../models/User");
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // NGN to USDT: amount is in kobo
    const ngnAmount = data.amount / 100;
    const usdtAmount = parseFloat((ngnAmount / 1600).toFixed(2));

    user.balance.usdt = parseFloat((user.balance.usdt + usdtAmount).toFixed(2));
    await user.save();

    res.json({ message: "Deposit confirmed", usdtCredited: usdtAmount, newBalance: user.balance.usdt });
  } catch (err) {
    console.error("Paystack verify error:", err.message);
    res.status(500).json({ error: "Verification failed" });
  }
});

/**
 * POST /api/payments/withdraw
 * Request a USDT withdrawal to wallet
 */
router.post(
  "/withdraw",
  protect,
  requireKYC,
  [
    body("amount").isFloat({ min: 1, max: 100000 }).withMessage("Amount must be between $1 and $100,000"),
    body("walletAddress").trim().notEmpty().withMessage("Wallet address required")
      .matches(/^0x[a-fA-F0-9]{40}$/).withMessage("Invalid Ethereum wallet address"),
  ],
  validate,
  async (req, res) => {
  try {
    const { amount, walletAddress } = req.body;
    if (req.user.balance.usdt < amount) return res.status(400).json({ error: "Insufficient balance" });

    // In production: trigger blockchain transfer via relayer
    req.user.balance.usdt -= amount;
    await req.user.save();

    res.json({ message: "Withdrawal initiated", amount, walletAddress });
  } catch (err) {
    res.status(500).json({ error: "Withdrawal failed" });
  }
});

// ─────────────────────────────────────────────────────────────────────
// cNGN / Stablesrail routes
// ─────────────────────────────────────────────────────────────────────

/**
 * POST /api/payments/cngn/initiate
 * Initiates a Naira → cNGN mint via Stablesrail/Numo
 * User sends NGN from their bank; receives cNGN (1:1 Naira stablecoin)
 * which we convert to USDT for the prediction balance
 */
router.post(
  "/cngn/initiate",
  protect,
  [
    body("amount").isFloat({ min: 1000, max: 10000000 }).withMessage("Minimum ₦1,000 for cNGN deposits"),
    body("bvn").isLength({ min: 11, max: 11 }).isNumeric().withMessage("Valid 11-digit BVN required"),
  ],
  validate,
  async (req, res) => {
  try {
    const { amount, bvn } = req.body;

    const txRef = `AFRIDICT-CNGN-${req.user._id}-${Date.now()}`;

    const response = await axios.post(
      `${STABLESRAIL_BASE_URL}/mint/initiate`,
      {
        amount,           // NGN amount
        currency: "NGN",
        bvn,
        reference: txRef,
        webhook_url: `${FRONTEND_URL.replace("3000","5000")}/api/webhooks/stablesrail`,
        metadata: { userId: req.user._id.toString(), txRef },
      },
      {
        headers: {
          "x-api-key": STABLESRAIL_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      reference: txRef,
      bankDetails: response.data.bankDetails, // virtual account to pay into
      expiresAt: response.data.expiresAt,
    });
  } catch (err) {
    console.error("cNGN initiate error:", err.response?.data || err.message);
    res.status(500).json({ error: "cNGN mint initiation failed" });
  }
});

// ─────────────────────────────────────────────────────────────────────
// WEBHOOKS
// ─────────────────────────────────────────────────────────────────────

/**
 * POST /api/webhooks/flutterwave
 * Flutterwave sends this after a payment is confirmed.
 * Set webhook URL in Flutterwave dashboard → Settings → Webhooks
 */
router.post("/webhooks/flutterwave", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    // Verify Flutterwave webhook signature
    const hash = req.headers["verif-hash"];
    if (!hash || hash !== FLUTTERWAVE_HASH) {
      return res.status(401).json({ error: "Invalid webhook signature" });
    }

    const event = JSON.parse(req.body);
    if (event.event !== "charge.completed") return res.sendStatus(200);

    const data = event.data;
    if (data.status !== "successful") return res.sendStatus(200);

    const userId = data.meta?.userId;
    if (!userId) return res.sendStatus(200);

    const User = require("../models/User");
    const user = await User.findById(userId);
    if (!user) return res.sendStatus(200);

    const usdtAmount = parseFloat((data.amount / NGN_RATE).toFixed(2));
    user.balance = (user.balance || 0) + usdtAmount;
    await user.save();

    // Emit real-time balance update to connected frontend
    const io = req.app.get("io");
    if (io) {
      io.to(`user:${userId}`).emit("deposit-success", {
        usdt: usdtAmount,
        ngn: data.amount,
        method: "flutterwave",
        txRef: data.tx_ref,
      });
    }

    console.log(`✅ Flutterwave deposit: ₦${data.amount} → ${usdtAmount} USDT for user ${userId}`);
    res.sendStatus(200);
  } catch (err) {
    console.error("Flutterwave webhook error:", err.message);
    res.sendStatus(500);
  }
});

/**
 * POST /api/webhooks/stablesrail
 * Stablesrail sends this after cNGN mint is confirmed.
 * Set webhook URL in Stablesrail dashboard → API Settings → Webhooks
 */
router.post("/webhooks/stablesrail", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    // Verify Stablesrail HMAC-SHA256 signature
    const signature  = req.headers["x-stablesrail-signature"];
    const bodyStr    = req.body.toString();
    const expected   = crypto.createHmac("sha256", STABLESRAIL_SECRET || "").update(bodyStr).digest("hex");

    if (signature !== `sha256=${expected}`) {
      return res.status(401).json({ error: "Invalid webhook signature" });
    }

    const event = JSON.parse(bodyStr);
    if (event.status !== "success") return res.sendStatus(200);

    const userId = event.metadata?.userId;
    if (!userId) return res.sendStatus(200);

    const User = require("../models/User");
    const user = await User.findById(userId);
    if (!user) return res.sendStatus(200);

    const ngnAmount  = parseFloat(event.amount);
    const usdtAmount = parseFloat((ngnAmount / NGN_RATE).toFixed(2));
    user.balance = (user.balance || 0) + usdtAmount;
    await user.save();

    const io = req.app.get("io");
    if (io) {
      io.to(`user:${userId}`).emit("deposit-success", {
        usdt: usdtAmount,
        ngn: ngnAmount,
        method: "cngn",
        txRef: event.reference,
      });
    }

    console.log(`✅ cNGN deposit: ₦${ngnAmount} → ${usdtAmount} USDT for user ${userId}`);
    res.sendStatus(200);
  } catch (err) {
    console.error("Stablesrail webhook error:", err.message);
    res.sendStatus(500);
  }
});

module.exports = router;
