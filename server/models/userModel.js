const User = require("./User");

exports.createUser = async (name, email, password) => {
  return await User.create({ name, email, password });
};

exports.findUser = async (email, password) => {
  return await User.findOne({ email, password });
};

exports.findByEmail = async (email) => {
  return await User.findOne({ email });
};