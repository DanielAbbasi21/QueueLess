const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Business = require("../models/Business");
const Ticket = require("../models/ticket");
const Notification = require("../models/Notification");
const BusinessBlock = require("../models/BusinessBlock");
const BusinessWarning = require("../models/BusinessWarning");


exports.register = async (req, res) => {
  const { name, email, password, role, business, businessName } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const userRole = role || "customer";

    if (!["customer", "business"].includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    if (userRole === "business" && !business && !businessName) {
      return res.status(400).json({
        success: false,
        message: "Business account requires a business ID or business name",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let businessId = null;

    if (userRole === "business") {
      if (business) {
        businessId = business;
      } else {
        const newBusiness = await Business.create({ 
          name: businessName 
        });
        businessId = newBusiness._id;
      }
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      business: userRole === "business" ? businessId : null,
    });

    await Notification.create({
      user: user._id,
      business: userRole === "business" ? businessId : null,
      type: "account_created",
      message: `Welcome to QueueLess, ${user.name}! Your ${userRole} account has been created successfully.`,
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        business: user.business,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      details: err.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        business: user.business,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        business: user.business,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to login",
      details: err.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate("business");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      details: err.message,
    });
  }
};

exports.deleteMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    if (user.role === "customer") {
      await Ticket.deleteMany({
        user: user._id,
      });


      await Notification.deleteMany({
        user: user._id,
      });


      await BusinessBlock.deleteMany({
        customer: user._id,
      });


      await BusinessWarning.deleteMany({
        customer: user._id,
      });
    }


    if (user.role === "business") {
      await Ticket.deleteMany({
        business: user.business,
      });


      await Notification.deleteMany({
        business: user.business,
      });


      await BusinessBlock.deleteMany({
        business: user.business,
      });


      await BusinessWarning.deleteMany({
        business: user.business,
      });


      const otherBusinessUsers = await User.countDocuments({
        _id: { $ne: user._id },
        business: user.business,
      });


      if (user.business && otherBusinessUsers === 0) {
        await Business.findByIdAndDelete(user.business);
      }
    }


    await User.findByIdAndDelete(user._id);


    res.json({
      success: true,
      message: "Account deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
      details: err.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const samePassword = await bcrypt.compare(newPassword, user.password);

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      details: err.message,
    });
  }
};