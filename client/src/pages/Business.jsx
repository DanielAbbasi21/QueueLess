import { useEffect, useState } from "react";
import {
  getBusinessTickets,
  startTicket,
  doneTicket,
  cancelTicket,
  warnCustomer,
  blockCustomer,
  unblockCustomer
} from "../services/api";

function Business() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTicketId, setOpenTicketId] = useState(null);

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
      alert(data.message || data.error || "Failed to fetch tickets");
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
      alert(res.error);
      return;
    }

    fetchTickets();
  };

  const handleDone = async (id) => {
    const res = await doneTicket(id);

    if (res.error) {
      alert(res.error);
      return;
    }

    fetchTickets();
  };

  const handleCancel = async (id) => {
  const reason = prompt("Why are you cancelling this ticket?");

  if (!reason || reason.trim() === "") {
    alert("Cancellation reason is required");
    return;
  }

  const res = await cancelTicket(id, reason.trim());

  if (res.error) {
    alert(res.error);
    return;
  }

  fetchTickets();
  alert("Ticket cancelled");
};

  const handleWarn = async (ticket) => {
    const reason = prompt("Why are you warning this customer?");

    if (!reason || reason.trim() === "") {
      alert("Warning reason is required");
      return;
    }

    const res = await warnCustomer({
      customer: ticket.user?._id,
      ticket: ticket._id,
      reason: reason.trim(),
    });

    if (res.error) {
      alert(res.error);
      return;
    }

    alert("Customer warned");
  };

  const handleBlock = async (ticket) => {
    const reason = prompt("Why are you blocking this customer?");

    if (!reason || reason.trim() === "") {
      alert("Block reason is required");
      return;
    }

    const res = await blockCustomer({
      customer: ticket.user?._id,
      ticket: ticket._id,
      reason: reason.trim(),
    });

    if (res.error) {
      alert(res.error);
      return;
    }

    fetchTickets();
    alert("Customer blocked");
  };

  const handleUnblock = async (ticket) => {
  const confirmUnblock = window.confirm(
    `Unblock ${ticket.user?.name || "this customer"}?`
  );

  if (!confirmUnblock) {
    return;
  }

  const res = await unblockCustomer({
    customer: ticket.user?._id,
  });

  if (res.error) {
    alert(res.error);
    return;
  }

  await fetchTickets();
  alert("Customer unblocked");
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

  return (
    <div className="dashboard-page">
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
                      onClick={() => handleCancel(t._id)}
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
                      onClick={() => handleWarn(t)}
                    >
                      Warn customer
                    </button>

                    <button
                      className="dashboard-button danger"
                      onClick={() => handleBlock(t)}
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
                      onClick={() => handleCancel(t._id)}
                    >
                      Cancel
                    </button>

                    <button
                      className="dashboard-button secondary"
                      onClick={() => handleWarn(t)}
                    >
                      Warn customer
                    </button>

                    <button
                      className="dashboard-button danger"
                      onClick={() => handleBlock(t)}
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

    </div>
  );
}

export default Business;
