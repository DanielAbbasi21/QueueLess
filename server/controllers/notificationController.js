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

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        error: "Notification not found",
      });
    }

    if (notification.user.toString() !== req.user.userId) {
      return res.status(403).json({
        error: "You can only update your own notifications",
      });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    res.status(500).json({
      error: "Failed to mark notification as read",
      details: err.message,
    });
  }
};

