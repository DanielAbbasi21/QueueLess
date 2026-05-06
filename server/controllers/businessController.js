const businessModel = require("../models/businessModel");

// CREATE
exports.createBusiness = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: "Business name is required" });
    }

    const business = await businessModel.createBusiness(name);
    res.status(201).json(business);
  } catch (err) {
    res.status(500).json({
      error: "Failed to create business",
      details: err.message,
    });
  }
};

// GET ALL
exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await businessModel.getAllBusinesses();
    res.json(businesses);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch businesses",
      details: err.message,
    });
  }
};