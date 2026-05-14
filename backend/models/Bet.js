const mongoose = require("mongoose");

const betSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    market:   { type: mongoose.Schema.Types.ObjectId, ref: "Market", required: true },
    marketId: { type: Number, required: true, index: true },
    marketTitle: { type: String, required: true },
    side:     { type: String, enum: ["yes", "no"], required: true },
    amount:   { type: Number, required: true, min: 0.5 },
    odds:     { type: Number, required: true },
    potentialWin: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "won", "lost", "cancelled"],
      default: "active",
    },
    settledAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bet", betSchema);
