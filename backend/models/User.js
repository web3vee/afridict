const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    walletAddress: {
      type: String,
      lowercase: true,
      sparse: true,
      index: true,
    },
    country: {
      type: String,
      required: true,
      enum: ["Nigeria", "Kenya", "South Africa", "Ghana", "Ethiopia", "Tanzania", "Uganda", "Senegal", "Ivory Coast", "Other"],
    },
    currency: {
      type: String,
      default: "USDT",
      enum: ["NGN", "KES", "ZAR", "GHS", "USDT"],
    },
    language: {
      type: String,
      default: "en",
      enum: ["en", "fr", "sw"], // English, French, Swahili
    },
    kyc: {
      status: {
        type: String,
        enum: ["none", "pending", "approved", "rejected"],
        default: "none",
      },
      submittedAt: Date,
      approvedAt: Date,
      documentType: String,
      documentHash: String, // hash of uploaded document
    },
    balance: {
      usdt: { type: Number, default: 0 },
    },
    totalBets: { type: Number, default: 0 },
    totalWinnings: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ["user", "admin", "resolver"],
      default: "user",
    },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Generate referral code on creation
userSchema.pre("save", function (next) {
  if (!this.referralCode) {
    this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    email: this.email,
    username: this.username,
    walletAddress: this.walletAddress,
    country: this.country,
    currency: this.currency,
    language: this.language,
    kyc: { status: this.kyc.status },
    balance: this.balance,
    totalBets: this.totalBets,
    totalWinnings: this.totalWinnings,
    referralCode: this.referralCode,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
