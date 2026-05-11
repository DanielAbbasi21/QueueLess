import { useEffect, useState } from "react";
import {
  getBusinessTickets,
  startTicket,
  doneTicket,
  cancelTicket,
} from "../services/api";

function Admin() {
  const [tickets, setTickets] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  
  const fetchTickets = async () => {
    if (!user?.business) return;

    const data = await getBusinessTickets();

    if (!Array.isArray(data)) {
      setTickets([]);
      alert(data.message || data.error || "Failed to fetch tickets");
      return;
    }

    setTickets(data);
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

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Business Dashboard</h2>
        <p className="dashboard-subtitle">
          Manage your queue and customer tickets.
        </p>
      </div>


      {tickets.length === 0 && (
        <p className="empty-message">No tickets found</p>
      )}


      <section className="dashboard-section">
        <h3 className="section-title">Active Customer</h3>


        {activeTickets.length === 0 && (
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
                <b>Status:</b> {t.status}
              </p>


              {t.started_at && (
                <p>
                  <b>Started:</b> {new Date(t.started_at).toLocaleString()}
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


        {waitingTickets.length === 0 && (
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
                <b>Status:</b> {t.status}
              </p>


              <p>
                <b>Created:</b> {new Date(t.created_at).toLocaleString()}
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


        {ticketHistory.length === 0 && (
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
                <b>Status:</b> {t.status}
              </p>


              <p>
                <b>Created:</b> {new Date(t.created_at).toLocaleString()}
              </p>


              {t.started_at && (
                <p>
                  <b>Started:</b> {new Date(t.started_at).toLocaleString()}
                </p>
              )}


              {t.completed_at && (
                <p>
                  <b>Completed:</b> {new Date(t.completed_at).toLocaleString()}
                </p>
              )}


              {t.cancelled_at && (
                <p>
                  <b>Cancelled:</b> {new Date(t.cancelled_at).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Admin;
