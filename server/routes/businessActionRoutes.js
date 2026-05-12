const express = require("express");
const router = express.Router();

const businessActionController = require("../controllers/businessActionController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/warn", verifyToken, businessActionController.warnCustomer);

module.exports = router;