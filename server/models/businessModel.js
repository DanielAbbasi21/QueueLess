const Business = require("./Business");

// CREATE
exports.createBusiness = async (name) => {
  return await Business.create({ name });
};

// GET ALL
exports.getAllBusinesses = async () => {
  return await Business.find().sort({ name: 1 });
};