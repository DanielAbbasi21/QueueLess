const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },

  message: String,

  status: {
    type: String,
    enum: ["waiting", "active", "done"],
    default: "waiting",
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
  started_at: Date,

  completed_at: Date,
});

module.exports = mongoose.model("Ticket", TicketSchema);