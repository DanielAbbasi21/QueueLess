const businessModel = require("../models/businessModel");

exports.getBusinesses = (req, res) => {
  businessModel.getAllBusinesses((err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
};