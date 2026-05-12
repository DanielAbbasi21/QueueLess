import { useEffect, useState } from "react";
import { getMyNotifications } from "../services/api";

function Inbox() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
        {notifications.map((notification) => (
          <div className="ticket-card" key={notification._id}>
            <p>
              <b>Message:</b> {notification.message}
            </p>

            {notification.business?.name && (
              <p>
                <b>Business:</b> {notification.business.name}
              </p>
            )}

            {notification.ticket?.message && (
              <p>
                <b>Ticket:</b> {notification.ticket.message}
              </p>
            )}

            <p>
              <b>Read:</b> {notification.read ? "Yes" : "No"}
            </p>

            <p>
              <b>Created:</b>{" "}
              {new Date(notification.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inbox;
