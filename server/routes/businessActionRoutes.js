const express = require("express");
const router = express.Router();

const businessActionController = require("../controllers/businessActionController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/warn", verifyToken, businessActionController.warnCustomer);
router.post("/block", verifyToken, businessActionController.blockCustomer);
router.post("/unblock", verifyToken, businessActionController.unblockCustomer);

module.exports = router;