import { useEffect, useState } from "react";
import { getBusinesses, createTicket, getMyTickets, cancelTicket } from "../services/api";

function Customer() {
  const [businesses, setBusinesses] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchMyTickets = async () => {
  if (!user) return;

  const data = await getMyTickets();

  if (!Array.isArray(data)) {
    setTickets([]);

    if (data.message === "Invalid or expired token" || data.message === "No token provided") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      alert("Your session has expired. Please log in again.");
      window.location.reload();
      return;
    }
    alert(data.message || data.error || "Failed to fetch tickets");
    return;
  }
  setTickets(data);
};

  useEffect(() => {
    getBusinesses().then((data) => setBusinesses(data));
    fetchMyTickets();

    const interval = setInterval(() => {
      fetchMyTickets();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      alert("You must be logged in");
      return;
    }

    if (!selectedBusiness) {
      alert("Please select a business");
      return;
    }

    if (!message) {
      alert("Please write a message");
      return;
    }

    const res = await createTicket({
      user: user._id,
      business: selectedBusiness,
      message: message,
    });

    console.log("Saved:", res);

    if (res.error) {
      alert(res.error);
      return;
    }

    setMessage("");
    setSelectedBusiness("");

    await fetchMyTickets();

    alert("Ticket created");
  };

  const handleCancel = async (id) => {
    const res = await cancelTicket(id);

    if (res.error) {
      alert(res.error);
      return;
    }

    await fetchMyTickets();
    alert("Ticket cancelled");
  };

  const currentTickets = tickets.filter(
    (ticket) => ticket.status === "waiting" || ticket.status === "active"
  );

  const ticketHistory = tickets.filter(
    (ticket) => ticket.status === "done" || ticket.status === "cancelled"
  );

  return (
     <div className="dashboard-page">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Customer Dashboard</h2>
        <p className="dashboard-subtitle">
          Create tickets and follow your queue status.
        </p>
      </div>


      <section className="dashboard-section">
        <h3 className="section-title">Create Ticket</h3>


        <div className="form-card">
          <div className="form-group">
            <select
              className="dashboard-select"
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
            >
              <option value="">Select a business</option>


              {businesses.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>


            <textarea
              className="dashboard-textarea"
              placeholder="What do you need help with?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />


            <button className="dashboard-button" onClick={handleSubmit}>
              Submit Ticket
            </button>
          </div>
        </div>
      </section>


      <section className="dashboard-section">
        <h3 className="section-title">Current Tickets</h3>


        {currentTickets.length === 0 && (
          <p className="empty-message">You have no active tickets.</p>
        )}


        <div className="ticket-grid">
          {currentTickets.map((t) => (
            <div className="ticket-card" key={t._id}>
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


              {t.status === "waiting" && (
                <>
                  <p>
                    <b>Queue position:</b> {t.queuePosition}
                  </p>


                  <p>
                    <b>Estimated wait:</b> {t.estimatedWaitTime} minutes
                  </p>
                </>
              )}


              {t.status === "active" && (
                <p>
                  <b>Queue position:</b> Now serving
                </p>
              )}


              {t.status === "waiting" && (
                <div className="ticket-actions">
                  <button
                    className="dashboard-button danger"
                    onClick={() => handleCancel(t._id)}
                  >
                    Cancel Ticket
                  </button>
                </div>
              )}
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
                <b>Created:</b> {new Date(t.created_at).toLocaleString()}
              </p>


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

export default Customer;