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
