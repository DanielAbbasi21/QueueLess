const mongoose = require("mongoose");

const BusinessBlockSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },

  reason: {
    type: String,
    required: true,
  },

  blocked_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

BusinessBlockSchema.index(
  { customer: 1, business: 1 },
  { unique: true }
);

module.exports = mongoose.model("BusinessBlock", BusinessBlockSchema);