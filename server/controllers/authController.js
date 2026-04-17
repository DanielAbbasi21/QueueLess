const db = require("../models/db");

exports.login = (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.json({ success: false });
    }
  });
};

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  const query = `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
  `;

  db.query(query, [name, email, password], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ success: true });
  });
};