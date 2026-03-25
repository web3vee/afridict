const express = require("express");
const router = express.Router();
const axios = require("axios");
const { protect, requireKYC } = require("../middleware/auth");

const FLUTTERWAVE_SECRET = process.env.FLUTTERWAVE_SECRET_KEY;
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

/**
 * POST /api/payments/flutterwave/initiate
 * Initiates a fiat deposit via Flutterwave
 * Currencies: NGN, KES, ZAR, GHS
 */
router.post("/flutterwave/initiate", protect, requireKYC, async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount || amount < 100) return res.status(400).json({ error: "Minimum deposit is 100" });
    if (!["NGN", "KES", "ZAR", "GHS"].includes(currency)) {
      return res.status(400).json({ error: "Unsupported currency" });
    }

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
        title: "AfriPredict Deposit",
        description: "Fund your AfriPredict wallet",
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

    user.balance.usdt += usdtAmount;
    await user.save();

    res.json({ message: "Deposit confirmed", usdtCredited: usdtAmount });
  } catch (err) {
    console.error("Flutterwave verify error:", err.message);
    res.status(500).json({ error: "Verification failed" });
  }
});

/**
 * POST /api/payments/paystack/initiate
 * Initiates a fiat deposit via Paystack (NGN primary)
 */
router.post("/paystack/initiate", protect, requireKYC, async (req, res) => {
  try {
    const { amount } = req.body; // amount in kobo (NGN)
    if (!amount || amount < 10000) return res.status(400).json({ error: "Minimum ₦100 (10000 kobo)" });

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

    user.balance.usdt += usdtAmount;
    await user.save();

    res.json({ message: "Deposit confirmed", usdtCredited: usdtAmount });
  } catch (err) {
    console.error("Paystack verify error:", err.message);
    res.status(500).json({ error: "Verification failed" });
  }
});

/**
 * POST /api/payments/withdraw
 * Request a USDT withdrawal to wallet
 */
router.post("/withdraw", protect, requireKYC, async (req, res) => {
  try {
    const { amount, walletAddress } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });
    if (!walletAddress) return res.status(400).json({ error: "Wallet address required" });
    if (req.user.balance.usdt < amount) return res.status(400).json({ error: "Insufficient balance" });

    // In production: trigger blockchain transfer via relayer
    req.user.balance.usdt -= amount;
    await req.user.save();

    res.json({ message: "Withdrawal initiated", amount, walletAddress });
  } catch (err) {
    res.status(500).json({ error: "Withdrawal failed" });
  }
});

module.exports = router;
