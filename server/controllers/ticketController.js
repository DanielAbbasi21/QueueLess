const ticketModel = require("../models/ticketModel");

exports.createTicket = (req, res) => {
  const { user_id, business_id, message } = req.body;

  ticketModel.createTicket(user_id, business_id, message, (err) => {
    if (err) return res.status(500).json(err);

    res.json({ success: true });
  });
};

exports.getTickets = (req, res) => {
  ticketModel.getAllTickets((err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
};