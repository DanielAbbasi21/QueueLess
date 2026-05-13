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
    enum: ["waiting", "active", "done", "cancelled", "blocked"],
    default: "waiting",
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
  started_at: Date,

  completed_at: Date,
  
  cancelled_at: Date,

  cancelled_reason: String,

  cancelled_by: {
    type: String,
    enum: ["customer", "business"],
  },
});

module.exports = mongoose.model("Ticket", TicketSchema);