const Notification = require("../models/Notification");

exports.getMyNotifications = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        error: "Only customers can access their notifications",
      });
    }

    const notifications = await Notification.find({
      user: req.user.userId,
    })
      .populate("business")
      .populate("ticket")
      .sort({ created_at: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch notifications",
      details: err.message,
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        error: "Only customers can update their notifications",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        read: true,
      },
      {
        returnDocument: "after",
      }
    )
      .populate("business")
      .populate("ticket");

    if (!notification) {
      return res.status(404).json({
        error: "Notification not found or does not belong to you",
      });
    }

    res.json(notification);
  } catch (err) {
    res.status(500).json({
      error: "Failed to mark notification as read",
      details: err.message,
    });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        error: "Only customers can access notification count",
      });
    }

    const count = await Notification.countDocuments({
      user: req.user.userId,
      read: false,
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch unread notification count",
      details: err.message,
    });
  }
};




