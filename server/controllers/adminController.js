const User = require("../models/User");
const Business = require("../models/Business");
const Ticket = require("../models/ticket");
const Notification = require("../models/Notification");
const BusinessBlock = require("../models/BusinessBlock");
const BusinessWarning = require("../models/BusinessWarning");
const bcrypt = require("bcrypt");


exports.getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCustomers,
      totalBusinessUsers,
      totalAdmins,
      totalBusinesses,
      totalTickets,
      waitingTickets,
      activeTickets,
      doneTickets,
      cancelledTickets,
      blockedTickets,
      totalNotifications,
      totalWarnings,
      totalBlocks,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "business" }),
      User.countDocuments({ role: "admin" }),
      Business.countDocuments(),
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: "waiting" }),
      Ticket.countDocuments({ status: "active" }),
      Ticket.countDocuments({ status: "done" }),
      Ticket.countDocuments({ status: "cancelled" }),
      Ticket.countDocuments({ status: "blocked" }),
      Notification.countDocuments(),
      BusinessWarning.countDocuments(),
      BusinessBlock.countDocuments(),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCustomers,
        totalBusinessUsers,
        totalAdmins,
        totalBusinesses,
        totalTickets,
        waitingTickets,
        activeTickets,
        doneTickets,
        cancelledTickets,
        blockedTickets,
        totalNotifications,
        totalWarnings,
        totalBlocks,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin stats",
      details: err.message,
    });
  }
};

exports.getAdminUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("business")
      .sort({ role: 1, name: 1 });

    res.json({
      success: true,
      users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      details: err.message,
    });
  }
};

exports.getAdminBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().sort({ name: 1 });

    const businessesWithTicketCount = await Promise.all(
      businesses.map(async (business) => {
        const ticketCount = await Ticket.countDocuments({
          business: business._id,
        });

        return {
          _id: business._id,
          name: business.name,
          category: business.category || "Business Services",
          ticketCount,
        };
      })
    );

    res.json({
      success: true,
      businesses: businessesWithTicketCount,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch businesses",
      details: err.message,
    });
  }
};

exports.getAdminTickets = async (req, res) => {
  try {
    const { status = "all" } = req.query;

    const filter = status === "all" ? {} : { status };

    const tickets = await Ticket.find(filter)
      .populate("user", "name email role")
      .populate("business")
      .sort({ created_at: -1 });

    res.json({
      success: true,
      tickets,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
      details: err.message,
    });
  }
};

exports.createAdminUser = async (req, res) => {
  try {
    const { name, email, password, role, businessName, businessCategory } = req.body;


    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required",
      });
    }


    if (!["customer", "business"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Admin can only create customer or business accounts",
      });
    }


    if (role === "business" && !businessName) {
      return res.status(400).json({
        success: false,
        message: "Business name is required for business accounts",
      });
    }


    const existingUser = await User.findOne({ email });


    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
    }


    let businessId = null;


    if (role === "business") {
      const existingBusiness = await Business.findOne({ name: businessName });


      if (existingBusiness) {
        return res.status(400).json({
          success: false,
          message: "A business with this name already exists",
        });
      }


      const newBusiness = await Business.create({
        name: businessName,
        category: businessCategory || "Business Services",
      });


      businessId = newBusiness._id;
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      business: businessId,
    });


    await Notification.create({
      user: user._id,
      business: businessId,
      type: "account_created",
      message: `Welcome to QueueLess, ${user.name}! Your account has been created by an admin. You can now log in and start using QueueLess.`,
    });


    const createdUser = await User.findById(user._id)
      .select("-password")
      .populate("business");


    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: createdUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create account",
      details: err.message,
    });
  }
};

exports.updateAdminUser = async (req, res) => {
  try {
    const { name, email, businessName, businessCategory } = req.body;


    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }


    const user = await User.findById(req.params.id).populate("business");


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    const emailExists = await User.findOne({
      email,
      _id: { $ne: user._id },
    });


    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Another user already uses this email",
      });
    }


    user.name = name;
    user.email = email;


    await user.save();


    if (user.role === "business" && user.business) {
      if (!businessName) {
        return res.status(400).json({
          success: false,
          message: "Business name is required for business accounts",
        });
      }


      const businessNameExists = await Business.findOne({
        name: businessName,
        _id: { $ne: user.business._id },
      });


      if (businessNameExists) {
        return res.status(400).json({
          success: false,
          message: "Another business already uses this name",
        });
      }


      await Business.findByIdAndUpdate(
        user.business._id,
        {
          name: businessName,
          category: businessCategory || "Business Services",
        },
        {
          returnDocument: "after",
        }
      );
    }


    const updatedUser = await User.findById(user._id)
      .select("-password")
      .populate("business");


    res.json({
      success: true,
      message: "Account updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update account",
      details: err.message,
    });
  }
};

exports.updateAdminBusiness = async (req, res) => {
  try {
    const { name, category } = req.body;


    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Business name is required",
      });
    }


    const business = await Business.findById(req.params.id);


    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }


    const existingBusiness = await Business.findOne({
      name,
      _id: { $ne: business._id },
    });


    if (existingBusiness) {
      return res.status(400).json({
        success: false,
        message: "Another business already uses this name",
      });
    }


    business.name = name;
    business.category = category || "Business Services";


    await business.save();


    res.json({
      success: true,
      message: "Business updated successfully",
      business,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update business",
      details: err.message,
    });
  }
};

exports.deleteAdminUser = async (req, res) => {
  try {
    const userId = req.params.id;


    if (req.user.userId === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }


    const user = await User.findById(userId).populate("business");


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    const businessId = user.business?._id || null;


    await Ticket.deleteMany({
      $or: [
        { user: user._id },
        ...(businessId ? [{ business: businessId }] : []),
      ],
    });


    await Notification.deleteMany({
      $or: [
        { user: user._id },
        ...(businessId ? [{ business: businessId }] : []),
      ],
    });


    await BusinessBlock.deleteMany({
      $or: [
        { customer: user._id },
        { blocked_by: user._id },
        ...(businessId ? [{ business: businessId }] : []),
      ],
    });


    await BusinessWarning.deleteMany({
      $or: [
        { customer: user._id },
        { warned_by: user._id },
        ...(businessId ? [{ business: businessId }] : []),
      ],
    });


    if (user.role === "business" && businessId) {
      await Business.findByIdAndDelete(businessId);
    }


    await User.findByIdAndDelete(user._id);


    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
      details: err.message,
    });
  }
};


exports.deleteAdminBusiness = async (req, res) => {
  try {
    const businessId = req.params.id;


    const business = await Business.findById(businessId);


    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }


    const businessUsers = await User.find({ business: businessId });


    const businessUserIds = businessUsers.map((user) => user._id);


    await Ticket.deleteMany({ business: businessId });


    await Notification.deleteMany({
      $or: [
        { business: businessId },
        { user: { $in: businessUserIds } },
      ],
    });


    await BusinessBlock.deleteMany({ business: businessId });


    await BusinessWarning.deleteMany({ business: businessId });


    await User.deleteMany({ business: businessId });


    await Business.findByIdAndDelete(businessId);


    res.json({
      success: true,
      message: "Business deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete business",
      details: err.message,
    });
  }
};

