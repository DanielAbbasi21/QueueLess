const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "business", "admin"],
    default: "customer",
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    default: null,
  },
});

module.exports = mongoose.model("User", UserSchema);