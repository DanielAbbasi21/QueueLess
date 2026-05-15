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
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
        business: null,
        };

    if (!adminData.name || !adminData.email || !adminData.password) {
        console.log("ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required");
        process.exit(1);
        }

    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
        existingAdmin.name = adminData.name;
        existingAdmin.password = await bcrypt.hash(adminData.password, 10);
        existingAdmin.role = "admin";
        existingAdmin.business = null;

        await existingAdmin.save();

        console.log("Admin account updated successfully");
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