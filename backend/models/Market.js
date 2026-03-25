const mongoose = require("mongoose");

const marketSchema = new mongoose.Schema(
  {
    contractId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["election", "sports", "commodity", "economy", "weather", "other"],
      required: true,
    },
    region: { type: String, required: true },
    endTime: { type: Date, required: true },
    resolutionTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["open", "closed", "resolved", "disputed", "cancelled"],
      default: "open",
    },
    outcome: {
      type: String,
      enum: ["none", "yes", "no"],
      default: "none",
    },
    yesPool: { type: Number, default: 0 },
    noPool: { type: Number, default: 0 },
    totalVolume: { type: Number, default: 0 },
    participantCount: { type: Number, default: 0 },
    creator: { type: String, required: true }, // wallet address
    imageUrl: String,
    tags: [String],
    sources: [String],  // news/data sources for verification
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Computed odds
marketSchema.virtual("yesOdds").get(function () {
  const total = this.yesPool + this.noPool;
  if (total === 0) return 50;
  return Math.round((this.yesPool / total) * 100);
});

marketSchema.virtual("noOdds").get(function () {
  return 100 - this.yesOdds;
});

marketSchema.set("toJSON", { virtuals: true });
marketSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Market", marketSchema);
