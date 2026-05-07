const ticketModel = require("../models/ticketModel");
const Ticket = require("../models/Ticket");

exports.createTicket = async (req, res) => {
  const { user, business, message } = req.body;

  try {
    if (!user) {
      return res.status(400).json({ error: "User is required" });
    }

    if (!business) {
      return res.status(400).json({ error: "Business is required" });
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