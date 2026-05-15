const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
  },

  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
  },

  type: {
    type: String,
    enum: [
      "ticket_cancelled",
      "ticket_created",
      "ticket_started",
      "ticket_done",
      "customer_warned",
      "customer_blocked",
      "customer_unblocked",
      "account_created"
    ],
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  read: {
    type: Boolean,
    default: false,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
