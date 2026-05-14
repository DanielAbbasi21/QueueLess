const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("../models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
        dbName: "queueless",
    });

    const adminData = {
      name: "QueueLess Admin",
      email: "admin@queueless.com",
      password: "Admin123",
      role: "admin",
      business: null,
    };

    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log("Admin already exists with this email");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    await User.create({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role,
      business: adminData.business,
    });

    console.log("Admin account created successfully");
    process.exit(0);
  } catch (err) {
    console.error("Failed to create admin:", err.message);
    process.exit(1);
  }
};

createAdmin();