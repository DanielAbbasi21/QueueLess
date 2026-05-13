import { useEffect, useState } from "react";
import { getBusinesses, createTicket, getMyTickets, cancelTicket, editTicket } from "../services/api";

function Customer() {
  const [businesses, setBusinesses] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [ticketMessage, setTicketMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [openTicketId, setOpenTicketId] = useState(null);
  const [ticketBusinessFilter, setTicketBusinessFilter] = useState("");
  
  const [businessSearch, setBusinessSearch] = useState("");
  const [selectedBusinessForTicket, setSelectedBusinessForTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);


  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchMyTickets = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const data = await getMyTickets();

    if (!Array.isArray(data)) {
      setTickets([]);
      setLoading(false);

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
    setLoading(false);
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

    if (!selectedBusinessForTicket) {
      alert("Please select a business");
      return;
    }

    if (!ticketMessage.trim()) {
      alert("Please write a message");
      return;
    }

    const res = await createTicket({
      user: user._id,
      business: selectedBusinessForTicket._id,
      message: ticketMessage,
    });

    console.log("Saved:", res);

    if (res.error) {
      alert(res.error);
      return;
    }

    setTicketMessage("");
    setSelectedBusinessForTicket(null);
    setShowTicketModal(false);

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

  const handleEdit = async (ticket) => {
    const newMessage = prompt("Edit your ticket message:", ticket.message);

    if (!newMessage || newMessage.trim() === "") {
      alert("Message is required");
      return;
    }

    const res = await editTicket(ticket._id, newMessage.trim());
    console.log("Edit response:", res);


    if (res.error) {
      alert(res.error);
      return;
    }

    await fetchMyTickets();
    alert("Ticket updated");
  };

  const filteredTickets = ticketBusinessFilter
  ? tickets.filter((ticket) => ticket.business?._id === ticketBusinessFilter)
  : tickets;

  const currentTickets = filteredTickets.filter(
    (ticket) => ticket.status === "waiting" || ticket.status === "active"
  );

  const ticketHistory = filteredTickets.filter(
    (ticket) =>
      ticket.status === "done" ||
      ticket.status === "cancelled" ||
      ticket.status === "blocked"
  );


  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };

  const getBusinessIcon = (businessName = "") => {
    const name = businessName.toLowerCase();


    if (name.includes("bank")) return "🏦";
    if (name.includes("barber")) return "✂️";
    if (name.includes("hospital")) return "✚";


    return "🏢";
  };


  const getBusinessCategory = (businessName = "") => {
    const name = businessName.toLowerCase();


    if (name.includes("bank")) return "Banking & Financial Services";
    if (name.includes("barber")) return "Personal Care & Grooming";
    if (name.includes("hospital")) return "Healthcare & Medical Services";


    return "Business Services";
  };


  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(businessSearch.toLowerCase())
  );


  const toggleTicket = (id) => {
    setOpenTicketId(openTicketId === id ? null : id);
  };

  const closeTicketModal = () => {
    setShowTicketModal(false);
    setSelectedBusinessForTicket(null);
    setTicketMessage("");
  };

  return (
     <div className="dashboard-page">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Customer Dashboard</h2>
      </div>


      <section className="dashboard-section business-discovery">
        <div className="business-discovery-header">
          <h3 className="section-title">Find a Business</h3>
          <p className="dashboard-subtitle">
            Search for a business to get started or browse available options below.
          </p>
        </div>

        <div className="business-search-wrapper">
          <span className="business-search-icon">⌕</span>

          <input
            className="business-search-input"
            type="text"
            placeholder="Search for a business..."
            value={businessSearch}
            onChange={(e) => setBusinessSearch(e.target.value)}
          />
        </div>

        <div className="business-card-grid">
          {filteredBusinesses.map((business) => (
            <button
              className="business-option-card"
              key={business._id}
              type="button"
              onClick={() => {
                setSelectedBusinessForTicket(business);
                setShowTicketModal(true);
              }}
            >
              <div className="business-option-icon">
                {getBusinessIcon(business.name)}
              </div>

              <div className="business-option-content">
                <h4>{business.name}</h4>
                <p>{getBusinessCategory(business.name)}</p>
              </div>

              <span className="business-option-arrow">›</span>
            </button>
          ))}
        </div>

        {filteredBusinesses.length === 0 && (
          <p className="empty-message">No businesses match your search.</p>
        )}
      </section>

      <section className="dashboard-section">
        <h3 className="section-title">Current Tickets</h3>

        {loading && <p className="empty-message">Loading tickets...</p>}

        {!loading && currentTickets.length === 0 && (
          <p className="empty-message">You have no active tickets right now. Create a ticket to join a queue.</p>
        )}


        <div className="ticket-grid">
          {currentTickets.map((t) => (
            <div className="ticket-card clickable-card" key={t._id}>
              <div onClick={() => toggleTicket(t._id)}>
                <p>
                  <b>Business:</b> {t.business?.name}
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

                <p className="helper-text">
                  {openTicketId === t._id
                    ? "Click to hide details"
                    : "Click to view details"}
                </p>
              </div>

              {openTicketId === t._id && (
                <>
                  <p>
                    <b>Message:</b> {t.message}
                  </p>

                  <p>
                    <b>Created:</b> {formatDate(t.created_at)}
                  </p>

                  {t.status === "waiting" && (
                    <p>
                      <b>Estimated wait:</b> {t.estimatedWaitTime} minutes
                    </p>
                  )}

                  {t.status === "waiting" && (
                    <div className="ticket-actions">
                      <button
                        className="dashboard-button secondary"
                        onClick={() => handleEdit(t)}
                      >
                        Edit Ticket
                      </button>

                      <button
                        className="dashboard-button danger"
                        onClick={() => handleCancel(t._id)}
                      >
                        Cancel Ticket
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </section>


      <section className="dashboard-section">
        <h3 className="section-title">Ticket History</h3>

        {ticketHistory.length === 0 && (
          <p className="empty-message">No completed or cancelled tickets yet.</p>
        )}


        <div className="ticket-grid">
          {ticketHistory.map((t) => (
            <div className="ticket-card clickable-card" key={t._id}>
              <div onClick={() => toggleTicket(t._id)}>
                <p>
                  <b>Business:</b> {t.business?.name}
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
                      <b>Message:</b> {t.message}
                    </p>

                    <p>
                      <b>Created:</b> {formatDate(t.created_at)}
                    </p>

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

                    {t.cancelled_reason && (
                      <p>
                        <b>{t.status === "blocked" ? "Blocked reason:" : "Cancellation reason:"}</b> {" "}
                        {t.cancelled_reason}
                      </p>
                    )}

                    {t.cancelled_by && (
                      <p>
                        <b>{t.status === "blocked" ? "Blocked By:" : "Cancelled By:"}</b> {" "}
                        {t.cancelled_by}
                      </p>
                    )}
                  </>
                )}
            </div>
          ))}
        </div>
      </section>
      {showTicketModal && selectedBusinessForTicket && (
        <div className="modal-overlay">
          <div className="ticket-modal">
            <button
              className="modal-close-button"
              type="button"
              onClick={closeTicketModal}
            >
              ×
            </button>

            <div className="ticket-modal-header">
              <div className="business-option-icon">
                {getBusinessIcon(selectedBusinessForTicket.name)}
              </div>

              <div>
                <h3>Create ticket for {selectedBusinessForTicket.name}</h3>
                <p>{getBusinessCategory(selectedBusinessForTicket.name)}</p>
              </div>
            </div>

            <p className="modal-helper-text">
              Tell us what you need help with and we will notify you when it is your turn.
            </p>

            <div className="form-group">
              <label>Message</label>

              <textarea
                className="dashboard-textarea"
                placeholder="Describe what you need help with..."
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                maxLength={500}
              />

              <p className="helper-text">{ticketMessage.length} / 500</p>
            </div>

            <div className="ticket-actions modal-actions">
              <button
                className="dashboard-button secondary"
                type="button"
                onClick={closeTicketModal}
              >
                Cancel
              </button>

              <button
                className="dashboard-button"
                type="button"
                onClick={handleSubmit}
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customer;