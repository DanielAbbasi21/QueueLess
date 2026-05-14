import { useEffect, useState } from "react";
import { getMyTickets, getBusinessTickets, unblockCustomer} from "../services/api";

function History({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyStatusFilter, setHistoryStatusFilter] = useState("all");
  const [openTicketId, setOpenTicketId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [unblockModalTicket, setUnblockModalTicket] = useState(null);


  const fetchHistoryTickets = async () => {
    const data =
      user.role === "customer"
        ? await getMyTickets()
        : await getBusinessTickets();

    if (!Array.isArray(data)) {
      setTickets([]);
      setLoading(false);
      showFeedback(data.message || data.error || "Failed to fetch ticket history", "error");
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

  const handleUnblock = async (ticket) => {
    const res = await unblockCustomer({
      customer: ticket.user?._id,
    });


    if (res.error) {
      showFeedback(res.error, "error");
      return;
    }


    setUnblockModalTicket(null);
    await fetchHistoryTickets();
    showFeedback("Customer unblocked", "success");
  };

  const getReasonText = (reason = "") => {
    if (!reason.includes("Reason:")) {
      return reason;
    }

    return reason.split("Reason:").pop().trim();
  };

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
                
                {t.status === "blocked" && t.cancelled_reason && (
                  <p>
                    <b>Reason:</b> {getReasonText(t.cancelled_reason)}
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

                {user.role === "business" && t.status === "blocked" && (
                  <div className="ticket-actions">
                    <button
                      className="dashboard-button secondary"
                      onClick={() => setUnblockModalTicket(t)}
                    >
                      Unblock customer
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      {unblockModalTicket && (
        <div className="modal-overlay">
          <div className="ticket-modal">
            <button
              className="modal-close-button"
              type="button"
              onClick={() => setUnblockModalTicket(null)}
            >
              ×
            </button>


            <div className="ticket-modal-header">
              <div>
                <h3>Unblock customer</h3>
                <p>
                  Customer: {unblockModalTicket.user?.name || "Unknown customer"}
                </p>
              </div>
            </div>


            <p className="modal-helper-text">
              Are you sure you want to unblock this customer? They will be able to create tickets for your business again.
            </p>


            <div className="ticket-actions modal-actions">
              <button
                className="dashboard-button secondary"
                type="button"
                onClick={() => setUnblockModalTicket(null)}
              >
                Cancel
              </button>


              <button
                className="dashboard-button"
                type="button"
                onClick={() => handleUnblock(unblockModalTicket)}
              >
                Confirm unblock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;