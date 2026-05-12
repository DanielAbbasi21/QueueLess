const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config();
const connectMongo = require("./config/mongo");

app.use(cors());

const ticketRoutes = require("./routes/ticketRoutes");
const businessRoutes = require("./routes/businessRoutes");
const authRoutes = require("./routes/authRoutes");
const notificationRoutes = require("./routes/notificationRoutes");


app.use(express.json());

app.get("/", (req, res) => {
  res.send("QueueLess API is running");
});

app.use("/tickets", ticketRoutes);
app.use("/businesses", businessRoutes);
app.use("/auth", authRoutes);
app.use("/notifications", notificationRoutes);


connectMongo();

app.listen(3030, () => {
  console.log("Server running on port 3030");
});

