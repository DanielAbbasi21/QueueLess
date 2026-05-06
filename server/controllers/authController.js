const User = require("../models/User");

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (user) {
      res.json({ success: true, user });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};


// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    await User.create({ name, email, password });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
};