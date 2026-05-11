import { useEffect, useState } from "react";
import {
  getBusinessTickets,
  startTicket,
  doneTicket,
  cancelTicket,
} from "../services/api";

function Business() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const res = await cancelTicket(id);

    if (res.error) {
      alert(res.error);
      return;
    }

    fetchTickets();
    alert("Ticket cancelled");
  };

  const activeTickets = tickets.filter((ticket) => ticket.status === "active");

  const waitingTickets = tickets.filter((ticket) => ticket.status === "waiting");

  const ticketHistory = tickets.filter(
    (ticket) => ticket.status === "done" || ticket.status === "cancelled"
  );

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Business Dashboard</h2>
        <p className="dashboard-subtitle">
          Manage your queue and customer tickets.
        </p>
      </div>


      {loading && <p className="empty-message">Loading tickets...</p>}

      {!loading && tickets.length === 0 && (
        <p className="empty-message">No tickets found</p>
      )}


      <section className="dashboard-section">
        <h3 className="section-title">Active Customer</h3>


        {!loading && activeTickets.length === 0 && (
          <p className="empty-message">No active customer.</p>
        )}


        <div className="ticket-grid">
          {activeTickets.map((t) => (
            <div className="ticket-card" key={t._id}>
              <p>
                <b>User:</b> {t.user?.name}
              </p>


              <p>
                <b>Business:</b> {t.business?.name}
              </p>


              <p>
                <b>Message:</b> {t.message}
              </p>


              <p>
                <b>Status:</b>{" "}
                <span className={`status-badge status-${t.status}`}>
                  {t.status}
                </span>
              </p>

              <p>
                  <b>Created:</b> {formatDate(t.created_at)}
              </p>


              {t.started_at && (
                <p>
                  <b>Started:</b> {formatDate(t.started_at)}
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
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>


      <section className="dashboard-section">
        <h3 className="section-title">Current Queue</h3>


        {!loading && waitingTickets.length === 0 && (
          <p className="empty-message">No waiting tickets.</p>
        )}


        <div className="ticket-grid">
          {waitingTickets.map((t) => (
            <div className="ticket-card" key={t._id}>
              <p>
                <b>User:</b> {t.user?.name}
              </p>


              <p>
                <b>Business:</b> {t.business?.name}
              </p>


              <p>
                <b>Message:</b> {t.message}
              </p>


              <p>
                <b>Status:</b>{" "}
                <span className={`status-badge status-${t.status}`}>
                  {t.status}
                </span>
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
              </div>
            </div>
          ))}
        </div>
      </section>


      <section className="dashboard-section">
        <h3 className="section-title">Ticket History</h3>


        {!loading && ticketHistory.length === 0 && (
          <p className="empty-message">No ticket history yet.</p>
        )}


        <div className="ticket-grid">
          {ticketHistory.map((t) => (
            <div className="ticket-card" key={t._id}>
              <p>
                <b>User:</b> {t.user?.name}
              </p>


              <p>
                <b>Business:</b> {t.business?.name}
              </p>


              <p>
                <b>Message:</b> {t.message}
              </p>


              <p>
                <b>Status:</b>{" "}
                <span className={`status-badge status-${t.status}`}>
                  {t.status}
                </span>
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
                  <b>Cancelled:</b> {formatDate(t.cancelled_at)}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Business;
