const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { verifyToken } = require("../middleware/authMiddleware");
const { verifyAdmin } = require("../middleware/adminMiddleware");

router.get("/stats", verifyToken, verifyAdmin, adminController.getAdminStats);
router.get("/users", verifyToken, verifyAdmin, adminController.getAdminUsers);
router.get("/businesses", verifyToken, verifyAdmin, adminController.getAdminBusinesses);
router.get("/tickets", verifyToken, verifyAdmin, adminController.getAdminTickets);

module.exports = router;