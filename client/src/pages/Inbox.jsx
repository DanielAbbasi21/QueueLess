import { useEffect, useState } from "react";
import { getMyNotifications, markNotificationAsRead } from "../services/api";

function Inbox() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openNotificationId, setOpenNotificationId] = useState(null);

  const fetchNotifications = async () => {
    const data = await getMyNotifications();

    if (!Array.isArray(data)) {
      setNotifications([]);
      setLoading(false);
      alert(data.message || data.error || "Failed to fetch notifications");
      return;
    }

    setNotifications(data);
    setLoading(false);
  };

  const handleMarkAsRead = async (id) => {
  const res = await markNotificationAsRead(id);

  if (res.error) {
    alert(res.error);
    return;
  }

  fetchNotifications();
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
        alert(res.error);
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

  return (
  <div className="dashboard-page">
    <div className="dashboard-header">
      <h2 className="dashboard-title">Inbox</h2>
      <p className="dashboard-subtitle">
        View updates about your tickets.
      </p>
    </div>

    {loading && <p className="empty-message">Loading inbox...</p>}

    {!loading && notifications.length === 0 && (
      <p className="empty-message">You have no notifications yet.</p>
    )}

    <div className="ticket-grid">
      {notifications.map((notification) => {
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
