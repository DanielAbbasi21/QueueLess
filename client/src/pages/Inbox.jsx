import { useEffect, useState } from "react";
import { getMyNotifications, markNotificationAsRead } from "../services/api";

function Inbox() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openNotificationId, setOpenNotificationId] = useState(null);
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  const fetchNotifications = async () => {
    const data = await getMyNotifications();

    if (!Array.isArray(data)) {
      setNotifications([]);
      setLoading(false);
      showFeedback(data.message || data.error || "Failed to fetch notifications");
      return;
    }

    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleNotification = async (notification) => {
    const isOpening = openNotificationId !== notification._id;

    setOpenNotificationId(isOpening ? notification._id : null);

    if (isOpening && !notification.read) {
      const res = await markNotificationAsRead(notification._id);

      if (res.error) {
        showFeedback(res.error, "error");
        return;
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((item) =>
          item._id === notification._id
            ? { ...item, read: true }
            : item
        )
      );
    }
  };

  const getNotificationParts = (message) => {
    if (!message || !message.includes("Reason:")) {
      return {
        mainMessage: message,
        reason: "",
      };
    }

    const [mainMessage, reason] = message.split("Reason:");

    return {
      mainMessage: mainMessage.trim(),
      reason: reason.trim(),
    };
  };

  const filteredNotifications =
    notificationFilter === "all"
      ? notifications
      : notifications.filter(
          (notification) => notification.type === notificationFilter
        );

  const showFeedback = (message, type = "success") => {
    setFeedbackMessage(message);
    setFeedbackType(type);


    setTimeout(() => {
      setFeedbackMessage("");
      setFeedbackType("");
    }, 3500);
  };

  return (
    <div className="dashboard-page">
      {feedbackMessage && (
        <div className={`toast-message ${feedbackType}`}>
          {feedbackMessage}
        </div>
      )}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Inbox</h2>
        <p className="dashboard-subtitle">
          View updates about your tickets.
        </p>
      </div>
      <div className="inbox-filter">
        <button
          className={`filter-button ${notificationFilter === "all" ? "active" : ""}`}
          onClick={() => setNotificationFilter("all")}
        >
          All
        </button>

        <button
          className={`filter-button ${
            notificationFilter === "ticket_cancelled" ? "active" : ""
          }`}
          onClick={() => setNotificationFilter("ticket_cancelled")}
        >
          Cancelled
        </button>

        <button
          className={`filter-button ${
            notificationFilter === "customer_warned" ? "active" : ""
          }`}
          onClick={() => setNotificationFilter("customer_warned")}
        >
          Warnings
        </button>

        <button
          className={`filter-button ${
            notificationFilter === "customer_blocked" ? "active" : ""
          }`}
          onClick={() => setNotificationFilter("customer_blocked")}
        >
          Blocked
        </button>
      </div>

      {loading && <p className="empty-message">Loading inbox...</p>}

      {!loading && filteredNotifications.length === 0 && (
        <p className="empty-message">No notifications found for this filter.</p>
      )}

      <div className="ticket-grid">
        {filteredNotifications.map((notification) => {
          const { mainMessage, reason } = getNotificationParts(
            notification.message
          );

          return (
            <div className="ticket-card clickable-card" key={notification._id}>
              <div
                className="notification-summary"
                onClick={() => toggleNotification(notification)}
              >
                <div className="notification-title-row">
                  {!notification.read && <span className="unread-dot"></span>}

                  <p>
                    <b>
                      You have a notification from{" "}
                      {notification.business?.name || "a business"}
                    </b>
                  </p>
                </div>

                <p className="helper-text">
                  {new Date(notification.created_at).toLocaleString()}
                </p>

                <p className="helper-text">
                  {openNotificationId === notification._id
                    ? "Click to hide details"
                    : "Click to view details"}
                </p>
              </div>

              {openNotificationId === notification._id && (
                <div className="notification-details">
                  <p>
                    <b>Message:</b> {mainMessage}
                  </p>

                  {reason && (
                    <p>
                      <b>Reason:</b> {reason}
                    </p>
                  )}

                  {notification.ticket?.message && (
                    <>
                      <p>
                        <b>Ticket:</b> {notification.ticket.message}
                      </p>
                    </>
                  )}

                  <p>
                    <b>Read:</b> {notification.read ? "Yes" : "No"}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Inbox;
