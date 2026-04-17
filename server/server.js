const express = require("express");
const db = require("./models/db");
const app = express();

const cors = require("cors");
app.use(cors());

const ticketRoutes = require("./routes/ticketRoutes");


app.use(express.json());

app.get("/", (req, res) => {
  res.send("QueueLess API is running");
});

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   const query = "SELECT * FROM users WHERE email = ? AND password = ?";

//   db.query(query, [email, password], (err, results) => {
//     if (err) return res.status(500).json(err);

//     if (results.length > 0) {
//       res.json({ success: true, user: results[0] });
//     } else {
//       res.json({ success: false });
//     }
//   });
// });

// app.post("/tickets", (req, res) => {
//   const { user_id, business_id, message } = req.body;

//   const query = `
//     INSERT INTO tickets (user_id, business_id, message)
//     VALUES (?, ?, ?)
//   `;

//   db.query(query, [user_id, business_id, message], (err, result) => {
//     if (err) return res.status(500).json(err);

//     res.json({ success: true });
//   });
// });


// app.get("/tickets", (req, res) => {
//   const query = `
//     SELECT 
//       tickets.id,
//       users.name AS user,
//       businesses.name AS business,
//       tickets.message,
//       tickets.status,
//       tickets.created_at
//     FROM tickets
//     JOIN users ON tickets.user_id = users.id
//     JOIN businesses ON tickets.business_id = businesses.id
//     ORDER BY tickets.created_at ASC
//   `;

//   db.query(query, (err, results) => {
//     if (err) return res.status(500).json(err);

//     res.json(results);
//   });
// });

const businessRoutes = require("./routes/businessRoutes");

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

app.use("/tickets", ticketRoutes);
app.use("/businesses", businessRoutes);

app.listen(3030, () => {
  console.log("Server running on port 3030");
});

