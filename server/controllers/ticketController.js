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

// START (set active)
exports.startTicket = (req, res) => {
  const id = req.params.id;

  ticketModel.startTicket(id, (err) => {
    if (err) return res.status(500).json(err);

    res.json({ success: true });
  });
};


// DONE (set done + timestamp)
exports.doneTicket = (req, res) => {
  const id = req.params.id;

  ticketModel.doneTicket(id, (err) => {
    if (err) return res.status(500).json(err);

    res.json({ success: true });
  });
};