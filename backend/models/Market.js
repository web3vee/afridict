const mongoose = require("mongoose");

const marketSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Sports", "Elections", "Politics", "Economy", "Music", "Crypto", "Security", "Commodities", "Weather", "Finance", "Tech", "Other"],
    },
    yesOdds: { type: Number, required: true },
    noOdds:  { type: Number, required: true },
    pool:    { type: Number, default: 0 },
    yesPool: { type: Number, default: 0 },
    noPool:  { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "pending", "closed", "resolved", "cancelled"],
      default: "active",
    },
    outcome: { type: String, enum: ["none", "yes", "no"], default: "none" },
    region:   { type: String, default: "Africa" },
    endTime:  { type: Date },
    imageUrl: { type: String },
    tags:     [String],
    featured: { type: Boolean, default: false },
    views:    { type: Number, default: 0 },
    creator:  { type: String, default: "admin" },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Market", marketSchema);
