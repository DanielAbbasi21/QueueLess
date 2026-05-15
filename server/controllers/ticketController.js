const ticketModel = require("../models/ticketModel");
const Ticket = require("../models/Ticket");
const Notification = require("../models/Notification");
const BusinessBlock = require("../models/BusinessBlock");
const Business = require("../models/Business");

exports.createTicket = async (req, res) => {
  const { user, business, message } = req.body;

  try {
    if (!user) {
      return res.status(400).json({ error: "User is required" });
    }

    if (!business) {
      return res.status(400).json({ error: "Business is required" });
    }

    const existingBlock = await BusinessBlock.findOne({
      customer: user,
      business,
    });

    if (existingBlock) {
      return res.status(403).json({
        error: "You are blocked from creating tickets for this business",
      });
    }

    const ticket = await ticketModel.createTicket(user, business, message);

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({
      error: "Failed to create ticket",
      details: err.message,
    });
  }
};

exports.getTickets = async (req, res) => {
  const { business, user } = req.query;

  try {
    const tickets = await ticketModel.getAllTickets(business, user);
    res.json(tickets);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch tickets",
      details: err.message,
    });
  }
};

exports.getEstimatedWaitForBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "Business ID is required",
      });
    }

    const estimatedWaitTime =
      await ticketModel.getEstimatedWaitForBusiness(businessId);

    res.json({
      success: true,
      estimatedWaitTime,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate estimated wait time",
      details: err.message,
    });
  }
};

exports.startTicket = async (req, res) => {
  try {
    if (req.user.role !== "business") {
      return res.status(403).json({ 
        error: "Only businesses can start tickets",
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    if (ticket.business.toString() !== req.user.business) {
      return res.status(403).json({ 
        error: "You can only start tickets for your own business" 
      });
    }

    const updated = await ticketModel.startTicket(req.params.id);

    if (!updated) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    if (updated.error) {
      return res.status(400).json({ error: updated.message });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: "Failed to start ticket",
      details: err.message,
    });
  }
};

exports.doneTicket = async (req, res) => {
  try {
    if (req.user.role !== "business") {
      return res.status(403).json({ 
        error: "Only businesses can complete tickets",
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    if (ticket.business.toString() !== req.user.business) {
      return res.status(403).json({ 
        error: "You can only complete tickets for your own business" 
       });
    }

    const updated = await ticketModel.doneTicket(req.params.id);

    if (!updated) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    if (updated.error) {
      return res.status(400).json({ error: updated.message });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: "Failed to complete ticket",
      details: err.message,
    });
  }
};

exports.cancelTicket = async (req, res) => {
  try {
    const reason = req.body?.reason;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    if (ticket.status === "done") {
      return res.status(400).json({
        error: "Done tickets cannot be cancelled",
      });
    }

    if (ticket.status === "cancelled") {
      return res.status(400).json({
        error: "Ticket is already cancelled",
      });
    }

    if (req.user.role === "customer") {
      if (ticket.user.toString() !== req.user.userId) {
        return res.status(403).json({
          error: "You can only cancel your own tickets",
        });
      }

      if (ticket.status !== "waiting") {
        return res.status(400).json({
          error: "Customers can only cancel waiting tickets",
        });
      }
    }

    if (req.user.role === "business") {

      if (!reason || reason.trim() === "") {
        return res.status(400).json({
          error: "Business must provide a reason for cancellation",
        });
      }

      if (ticket.business.toString() !== req.user.business) {
        return res.status(403).json({
          error: "You can only cancel tickets for your own business",
        });
      }

      if (ticket.status === "active") {
        if (!ticket.started_at) {
          return res.status(400).json({
            error: "Active ticket has no start time",
          });
        }

        const fiveMinutes = 5 * 60 * 1000;
        const timeSinceStart = Date.now() - new Date(ticket.started_at).getTime();

        if (timeSinceStart < fiveMinutes) {
          return res.status(400).json({
            error: "Active tickets can only be cancelled after 5 minutes",
          });
        }
      }

      if (!["waiting", "active"].includes(ticket.status)) {
        return res.status(400).json({
          error: "Business can only cancel waiting or active tickets",
        });
      }
    }

    if (!["customer", "business"].includes(req.user.role)) {
      return res.status(403).json({
        error: "Invalid user role",
      });
    }

    const cancelledReason = 
      req.user.role === "business" 
        ? reason.trim()
        : "Cancelled by customer";
    
    const cancelled = await ticketModel.cancelTicket(
      req.params.id, 
      cancelledReason, 
      req.user.role
    );

    if (req.user.role === "business") {
      const business = await Business.findById(ticket.business);

      await Notification.create({
        user: ticket.user,
        business: ticket.business,
        ticket: ticket._id,
        type: "ticket_cancelled",
        message: `Your ticket for ${business?.name || "this business"} has been cancelled. Reason: ${cancelledReason}`,
      });
    }

    res.json(cancelled);
  } catch (err) {
    res.status(500).json({
      error: "Failed to cancel ticket",
      details: err.message,
    });
  }
};

exports.getMyTickets = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        error: "Only customers can access their own tickets",
      });
    }


    const tickets = await ticketModel.getAllTickets(null, req.user.userId);


    res.json(tickets);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch customer tickets",
      details: err.message,
    });
  }
};


exports.getBusinessTickets = async (req, res) => {
  try {
    if (req.user.role !== "business") {
      return res.status(403).json({
        error: "Only business users can access business tickets",
      });
    }


    if (!req.user.business) {
      return res.status(400).json({
        error: "Business user is not connected to a business",
      });
    }


    const tickets = await ticketModel.getAllTickets(req.user.business, null);


    res.json(tickets);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch business tickets",
      details: err.message,
    });
  }
};

exports.editTicket = async (req, res) => {
  try {
    const { message } = req.body;

    if (req.user.role !== "customer") {
      return res.status(403).json({
        error: "Only customers can edit tickets",
      });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        error: "Ticket not found",
      });
    }

    if (ticket.user.toString() !== req.user.userId) {
      return res.status(403).json({
        error: "You can only edit your own tickets",
      });
    }

    if (ticket.status !== "waiting") {
      return res.status(400).json({
        error: "Only waiting tickets can be edited",
      });
    }

    const updated = await ticketModel.editTicket(req.params.id, message.trim());

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: "Failed to edit ticket",
      details: err.message,
    });
  }
};
