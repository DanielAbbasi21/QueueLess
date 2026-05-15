const mongoose = require("mongoose");


const BusinessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },


  category: {
    type: String,
    default: "Business Services",
  },
});


module.exports = mongoose.model("Business", BusinessSchema);
