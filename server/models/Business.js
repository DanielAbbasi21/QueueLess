const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Business", BusinessSchema);