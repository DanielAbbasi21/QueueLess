const User = require("../models/User");
const Business = require("../models/Business");
const Ticket = require("../models/Ticket");
const Notification = require("../models/Notification");
const BusinessBlock = require("../models/BusinessBlock");
const BusinessWarning = require("../models/BusinessWarning");

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