const express = require("express");
require("./models/db");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("QueueLess API is running");
});

app.post("/login", (req, res) => {
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
});

app.post("/tickets", (req, res) => {
  const { user_id, business_id, message } = req.body;

  const query = `
    INSERT INTO tickets (user_id, business_id, message)
    VALUES (?, ?, ?)
  `;

  db.query(query, [user_id, business_id, message], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ success: true });
  });
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});

