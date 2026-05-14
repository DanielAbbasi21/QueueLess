import { useEffect, useState } from "react";
import {
  getBusinessTickets,
  startTicket,
  doneTicket,
  cancelTicket,
  warnCustomer,
  blockCustomer,
} from "../services/api";

function Business() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTicketId, setOpenTicketId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [actionModal, setActionModal] = useState(null);
  const [actionReason, setActionReason] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  
  const fetchTickets = async () => {
    if (!user?.business) {
      setLoading(false);
      return;
    }

    const data = await getBusinessTickets();

    if (!Array.isArray(data)) {
      setTickets([]);
      setLoading(false);
      showFeedback(data.message || data.error || "Failed to fetch tickets");
      return;
    }

    setTickets(data);
    setLoading(false);
  };
  

  useEffect(() => {
    fetchTickets();

    const interval = setInterval(() => {
      fetchTickets();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStart = async (id) => {
    const res = await startTicket(id);

    if (res.error) {
      showFeedback(res.error, "error");
      return;
    }

    fetchTickets();
  };

  const handleDone = async (id) => {
    const res = await doneTicket(id);

    if (res.error) {
      showFeedback(res.error, "error");
      return;
    }

    fetchTickets();
  };

  const activeTickets = tickets.filter((ticket) => ticket.status === "active");

  const waitingTickets = tickets.filter((ticket) => ticket.status === "waiting");


  const canCancelNoShow = (startedAt) => {
    if (!startedAt) return false;

    const fiveMinutes = 5 * 60 * 1000;
    const startedTime = new Date(startedAt).getTime();

    return Date.now() - startedTime >= fiveMinutes;
  };

  const getNoShowAvailableTime = (startedAt) => {
    if (!startedAt) return "-";

    const fiveMinutes = 5 * 60 * 1000;
    const availableTime = new Date(new Date(startedAt).getTime() + fiveMinutes);

    return availableTime.toLocaleString();
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };

  const toggleTicket = (id) => {
    setOpenTicketId((currentId) => (currentId === id ? null : id));
  };

  const showFeedback = (message, type = "success") => {
    setFeedbackMessage(message);
    setFeedbackType(type);


    setTimeout(() => {
      setFeedbackMessage("");
      setFeedbackType("");
    }, 3500);
  };

  const openActionModal = (type, ticket) => {
    setActionModal({ type, ticket });
    setActionReason("");
  };


  const closeActionModal = () => {
    setActionModal(null);
    setActionReason("");
  };

  const submitActionModal = async () => {
    if (!actionModal) return;


    if (!actionReason.trim()) {
      showFeedback("Reason is required", "error");
      return;
    }


    const { type, ticket } = actionModal;


    if (type === "cancel") {
      const res = await cancelTicket(ticket._id, actionReason.trim());


      if (res.error) {
        showFeedback(res.error, "error");
        return;
      }


      await fetchTickets();
      showFeedback("Ticket cancelled", "success");
    }


    if (type === "warn") {
      const res = await warnCustomer({
        customer: ticket.user?._id,
        ticket: ticket._id,
        reason: actionReason.trim(),
      });


      if (res.error) {
        showFeedback(res.error, "error");
        return;
      }


      showFeedback("Customer warned", "success");
    }


    if (type === "block") {
      const res = await blockCustomer({
        customer: ticket.user?._id,
        ticket: ticket._id,
        reason: actionReason.trim(),
      });


      if (res.error) {
        showFeedback(res.error, "error");
        return;
      }


      await fetchTickets();
      showFeedback("Customer blocked", "success");
    }


    closeActionModal();
  };

  return (
    <div className="dashboard-page">
      {feedbackMessage && (
        <div className={`toast-message ${feedbackType}`}>
          {feedbackMessage}
        </div>
      )}
    
      <div className="dashboard-header">
        <h2 className="dashboard-title">Business Dashboard</h2>
      </div>

      {loading && <p className="empty-message">Loading tickets...</p>}

      {!loading && tickets.length === 0 && (
        <p className="empty-message">No tickets have been created for your business yet.</p>
      )}


      <section className="dashboard-section">
        <h3 className="section-title">Active Customer</h3>


        {!loading && activeTickets.length === 0 && (
          <p className="empty-message">No active customer right now.</p>
        )}


        <div className="ticket-grid">
          {activeTickets.map((t) => (
            <div className="ticket-card clickable-card" key={t._id}>
              <div onClick={() => toggleTicket(t._id)}>
                <p>
                  <b>User:</b> {t.user?.name}
                </p>

                <p>
                  <b>Status:</b>{" "}
                  <span className={`status-badge status-${t.status}`}>
                    {t.status}
                  </span>
                </p>

                <p className="helper-text">
                  {openTicketId === t._id ? "Click to hide details" : "Click to view details"}
                </p>
              </div>

              {openTicketId === t._id && (
                <>
                  <p>
                    <b>Business:</b> {t.business?.name}
                  </p>

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

                  {t.started_at && (
                    <p>
                      <b>No-show cancel available after:</b>{" "}
                      {getNoShowAvailableTime(t.started_at)}
                    </p>
                  )}

                  <div className="ticket-actions">
                    <button
                      className="dashboard-button"
                      onClick={() => handleDone(t._id)}
                    >
                      Done
                    </button>

                    <button
                      className="dashboard-button danger"
                      onClick={() => openActionModal("cancel", t)}
                      disabled={!canCancelNoShow(t.started_at)}
                      title={
                        canCancelNoShow(t.started_at)
                          ? "Cancel this no-show ticket"
                          : "You can cancel this ticket after 5 minutes"
                      }
                    >
                      Cancel No-show
                    </button>
                    
                    <button
                      className="dashboard-button secondary"
                      onClick={() => openActionModal("warn", t)}
                    >
                      Warn customer
                    </button>

                    <button
                      className="dashboard-button danger"
                      onClick={() => openActionModal("block", t)}
                    >
                      Block customer
                    </button>
                  </div>

                  {!canCancelNoShow(t.started_at) && (
                    <p className="helper-text">
                      You can cancel this active ticket if the customer has not arrived after 5 minutes.
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </section>


      <section className="dashboard-section">
        <h3 className="section-title">Current Queue</h3>


        {!loading && waitingTickets.length === 0 && (
          <p className="empty-message">No customers waiting right now.</p>
        )}


        <div className="ticket-grid">
          {waitingTickets.map((t) => (
            <div className="ticket-card clickable-card" key={t._id}>
              <div onClick={() => toggleTicket(t._id)}>
                <p>
                  <b>User:</b> {t.user?.name}
                </p>

                <p>
                  <b>Status:</b>{" "}
                  <span className={`status-badge status-${t.status}`}>
                    {t.status}
                  </span>
                </p>

                <p className="helper-text">
                  {openTicketId === t._id ? "Click to hide details" : "Click to view details"}
                </p>
              </div>

              {openTicketId === t._id && (
                <>
                  <p>
                    <b>Business:</b> {t.business?.name}
                  </p>

                  <p>
                    <b>Message:</b> {t.message}
                  </p>

                  <p>
                    <b>Created:</b> {formatDate(t.created_at)}
                  </p>


                  <div className="ticket-actions">
                    <button
                      className="dashboard-button"
                      onClick={() => handleStart(t._id)}
                    >
                      Start
                    </button>

                    <button
                      className="dashboard-button danger"
                      onClick={() => openActionModal("cancel", t)}
                    >
                      Cancel
                    </button>

                    <button
                      className="dashboard-button secondary"
                      onClick={() => openActionModal("warn", t)}
                    >
                      Warn customer
                    </button>

                    <button
                      className="dashboard-button danger"
                      onClick={() => openActionModal("block", t)}
                    >
                      Block customer
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
      {actionModal && (
        <div className="modal-overlay">
          <div className="ticket-modal">
            <button
              className="modal-close-button"
              type="button"
              onClick={closeActionModal}
            >
              ×
            </button>

            <div className="ticket-modal-header">
              <div>
                <h3>
                  {actionModal.type === "cancel" && "Cancel ticket"}
                  {actionModal.type === "warn" && "Warn customer"}
                  {actionModal.type === "block" && "Block customer"}
                </h3>
                <p>
                  Customer: {actionModal.ticket.user?.name || "Unknown customer"}
                </p>
              </div>
            </div>

            <p className="modal-helper-text">
              {actionModal.type === "cancel" &&
                "Write the reason for cancelling this ticket."}
              {actionModal.type === "warn" &&
                "Write the reason for warning this customer."}
              {actionModal.type === "block" &&
                "Write the reason for blocking this customer."}
            </p>

            <div className="form-group">
              <label>Reason</label>

              <textarea
                className="dashboard-textarea"
                placeholder="Write reason..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                maxLength={500}
              />

              <p className="helper-text">{actionReason.length} / 500</p>
            </div>

            <div className="ticket-actions modal-actions">
              <button
                className="dashboard-button secondary"
                type="button"
                onClick={closeActionModal}
              >
                Cancel
              </button>

              <button
                className={
                  actionModal.type === "block" || actionModal.type === "cancel"
                    ? "dashboard-button danger"
                    : "dashboard-button"
                }
                type="button"
                onClick={submitActionModal}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Business;
