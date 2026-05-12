const mongoose = require("mongoose");

const BusinessWarningSchema = new mongoose.Schema({
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

  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
  },

  reason: {
    type: String,
    required: true,
  },

  warned_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BusinessWarning", BusinessWarningSchema);