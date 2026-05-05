const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");

router.post("/", ticketController.createTicket);
router.get("/", ticketController.getTickets);
router.put("/start/:id", ticketController.startTicket);
router.put("/done/:id", ticketController.doneTicket);


module.exports = router;