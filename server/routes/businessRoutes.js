const express = require("express");
const router = express.Router();
const businessController = require("../controllers/businessController");

router.get("/", businessController.getBusinesses);

module.exports = router;