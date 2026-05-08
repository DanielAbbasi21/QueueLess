const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, ticketController.createTicket);
router.get("/", verifyToken, ticketController.getTickets);
router.put("/start/:id", verifyToken, ticketController.startTicket);
router.put("/done/:id", verifyToken, ticketController.doneTicket);
router.put("/cancel/:id", verifyToken, ticketController.cancelTicket);
router.get("/my", verifyToken, ticketController.getMyTickets);
router.get("/business", verifyToken, ticketController.getBusinessTickets);


module.exports = router;
