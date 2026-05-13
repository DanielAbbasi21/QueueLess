import { useEffect, useState } from "react";
import { getMyTickets, getBusinessTickets } from "../services/api";

function History({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyStatusFilter, setHistoryStatusFilter] = useState("all");
  const [openTicketId, setOpenTicketId] = useState(null);

  const fetchHistoryTickets = async () => {
    const data =
      user.role === "customer"
        ? await getMyTickets()
        : await getBusinessTickets();

    if (!Array.isArray(data)) {
      setTickets([]);
      setLoading(false);
      alert(data.message || data.error || "Failed to fetch ticket history");
      return;
    }

    setTickets(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistoryTickets();

    const interval = setInterval(() => {
      fetchHistoryTickets();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  const toggleTicket = (id) => {
    setOpenTicketId(openTicketId === id ? null : id);
  };

  const allTicketHistory = tickets.filter(
    (ticket) =>
      ticket.status === "done" ||
      ticket.status === "cancelled" ||
      ticket.status === "blocked"
  );

  const ticketHistory =
    historyStatusFilter === "all"
      ? allTicketHistory
      : allTicketHistory.filter(
          (ticket) => ticket.status === historyStatusFilter
        );

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Ticket History</h2>
        <p className="dashboard-subtitle">
          View completed, cancelled, and blocked tickets.
        </p>
      </div>

      <div className="history-filter">
        <button
          className={`filter-button ${
            historyStatusFilter === "all" ? "active" : ""
          }`}
          onClick={() => setHistoryStatusFilter("all")}
        >
          All
        </button>

        <button
          className={`filter-button ${
            historyStatusFilter === "done" ? "active" : ""
          }`}
          onClick={() => setHistoryStatusFilter("done")}
        >
          Done
        </button>

        <button
          className={`filter-button ${
            historyStatusFilter === "cancelled" ? "active" : ""
          }`}
          onClick={() => setHistoryStatusFilter("cancelled")}
        >
          Cancelled
        </button>

        <button
          className={`filter-button ${
            historyStatusFilter === "blocked" ? "active" : ""
          }`}
          onClick={() => setHistoryStatusFilter("blocked")}
        >
          Blocked
        </button>
      </div>

      {loading && <p className="empty-message">Loading history...</p>}

      {!loading && ticketHistory.length === 0 && (
        <p className="empty-message">No tickets found for this filter.</p>
      )}

      <div className="ticket-grid">
        {ticketHistory.map((t) => (
          <div className="ticket-card clickable-card" key={t._id}>
            <div onClick={() => toggleTicket(t._id)}>
              <p>
                <b>{user.role === "business" ? "User" : "Business"}:</b>{" "}
                {user.role === "business" ? t.user?.name : t.business?.name}
              </p>

              <p>
                <b>Status:</b>{" "}
                <span className={`status-badge status-${t.status}`}>
                  {t.status}
                </span>
              </p>

              <p className="helper-text">
                {openTicketId === t._id
                  ? "Click to hide details"
                  : "Click to view details"}
              </p>
            </div>

            {openTicketId === t._id && (
              <>
                {user.role === "business" && (
                  <p>
                    <b>Business:</b> {t.business?.name}
                  </p>
                )}

                <p>
                  <b>Message:</b> {t.message}
                </p>

                <p>
                  <b>Created:</b> {formatDate(t.created_at)}
                </p>

                {t.started_at && (
                  <p>
                    <b>Started:</b> {formatDate(t.started_at)}
                  </p>
                )}

                {t.completed_at && (
                  <p>
                    <b>Completed:</b> {formatDate(t.completed_at)}
                  </p>
                )}

                {t.cancelled_at && (
                  <p>
                    <b>{t.status === "blocked" ? "Blocked" : "Cancelled"}:</b>{" "}
                    {formatDate(t.cancelled_at)}
                  </p>
                )}

                {t.cancelled_reason && (
                  <p>
                    <b>
                      {t.status === "blocked"
                        ? "Blocked reason:"
                        : "Cancellation reason:"}
                    </b>{" "}
                    {t.cancelled_reason}
                  </p>
                )}

                {t.cancelled_by && (
                  <p>
                    <b>
                      {t.status === "blocked"
                        ? "Blocked by:"
                        : "Cancelled by:"}
                    </b>{" "}
                    {t.cancelled_by}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;