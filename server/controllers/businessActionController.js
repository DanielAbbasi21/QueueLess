const BusinessWarning = require("../models/BusinessWarning");
const Ticket = require("../models/Ticket");
const Notification = require("../models/Notification");

exports.warnCustomer = async (req, res) => {
  try {
    const { customer, ticket, reason } = req.body;

    if (req.user.role !== "business") {
      return res.status(403).json({
        error: "Only business users can warn customers",
      });
    }

    if (!customer) {
      return res.status(400).json({
        error: "Customer is required",
      });
    }

    if (!ticket) {
      return res.status(400).json({
        error: "Ticket is required",
      });
    }

    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        error: "Warning reason is required",
      });
    }

    const foundTicket = await Ticket.findById(ticket);

    if (!foundTicket) {
      return res.status(404).json({
        error: "Ticket not found",
      });
    }

    if (foundTicket.business.toString() !== req.user.business) {
      return res.status(403).json({
        error: "You can only warn customers from your own business tickets",
      });
    }

    if (foundTicket.user.toString() !== customer) {
      return res.status(400).json({
        error: "Customer does not match ticket user",
      });
    }

    const warning = await BusinessWarning.create({
      customer,
      business: req.user.business,
      ticket,
      reason: reason.trim(),
      warned_by: req.user.userId,
    });

    await Notification.create({
      user: customer,
      business: req.user.business,
      ticket,
      type: "customer_warned",
      message: `You received a warning from this business. Reason: ${reason.trim()}`,
    });

    res.status(201).json(warning);
  } catch (err) {
    res.status(500).json({
      error: "Failed to warn customer",
      details: err.message,
    });
  }
};