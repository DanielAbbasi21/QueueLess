const BusinessWarning = require("../models/BusinessWarning");
const Ticket = require("../models/Ticket");
const Notification = require("../models/Notification");
const BusinessBlock = require("../models/BusinessBlock");
const User = require("../models/User");

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

exports.blockCustomer = async (req, res) => {
    try {
      const { customer, ticket, reason } = req.body;

      if (req.user.role !== "business") {
        return res.status(403).json({
          error: "Only business users can block customers",
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
          error: "Block reason is required",
        });
      }

      const foundCustomer = await User.findById(customer);

      if (!foundCustomer) {
        return res.status(404).json({
          error: "Customer not found",
        });
      }

      if (foundCustomer.role !== "customer") {
        return res.status(400).json({
          error: "Only customer accounts can be blocked",
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
          error: "You can only block customers from your own business tickets",
        });
      }

      if (foundTicket.user.toString() !== customer) {
        return res.status(400).json({
          error: "Customer does not match ticket user",
        });
      }

      const existingBlock = await BusinessBlock.findOne({
        customer,
        business: req.user.business,
      });

      if (existingBlock) {
        return res.status(400).json({
          error: "Customer is already blocked by this business",
        });
      }

      const block = await BusinessBlock.create({
        customer,
        business: req.user.business,
        reason: reason.trim(),
        blocked_by: req.user.userId,
      });

      await Ticket.findByIdAndUpdate(
        ticket,
        {
          status: "blocked",
          cancelled_at: new Date(),
          cancelled_reason: `Customer blocked. Reason: ${reason.trim()}`,
          cancelled_by: "business",
        },
        { new: true }
      );

      await Notification.create({
        user: customer,
        business: req.user.business,
        type: "customer_blocked",
        message: `You have been blocked by this business. Reason: ${reason.trim()}`,
      });

      res.status(201).json(block);
    } catch (err) {
      res.status(500).json({
        error: "Failed to block customer",
        details: err.message,
      });
    }
  };

  exports.unblockCustomer = async (req, res) => {
  try {
    const { customer } = req.body;

    if (req.user.role !== "business") {
      return res.status(403).json({
        error: "Only business users can unblock customers",
      });
    }

    if (!customer) {
      return res.status(400).json({
        error: "Customer is required",
      });
    }

    const existingBlock = await BusinessBlock.findOne({
      customer,
      business: req.user.business,
    });

    if (!existingBlock) {
      return res.status(404).json({
        error: "Customer is not blocked by this business",
      });
    }

    await BusinessBlock.findByIdAndDelete(existingBlock._id);

    await Ticket.updateMany(
      {
        user: customer,
        business: req.user.business,
        status: "blocked",
      },
      {
        status: "cancelled",
        cancelled_reason: "Customer was unblocked. Ticket moved from blocked to cancelled.",
        cancelled_by: "business",
      }
    );

    await Notification.create({
      user: customer,
      business: req.user.business,
      type: "customer_unblocked",
      message: "You have been unblocked by this business.",
    });

    res.json({
      message: "Customer unblocked",
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to unblock customer",
      details: err.message,
    });
  }
};
