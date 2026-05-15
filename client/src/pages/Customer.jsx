import { useEffect, useState } from "react";
import { getBusinesses, createTicket, getMyTickets, cancelTicket, editTicket, getEstimatedWaitForBusiness, } from "../services/api";

function Customer() {
  const [businesses, setBusinesses] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [ticketMessage, setTicketMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [openTicketId, setOpenTicketId] = useState(null);
  const [ticketBusinessFilter, setTicketBusinessFilter] = useState("");  
  const [businessSearch, setBusinessSearch] = useState("");
  const [showBusinesses, setShowBusinesses] = useState(true);
  const [selectedBusinessForTicket, setSelectedBusinessForTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [editModalTicket, setEditModalTicket] = useState(null);
  const [editTicketMessage, setEditTicketMessage] = useState("");
  const [estimatedWaitBeforeSubmit, setEstimatedWaitBeforeSubmit] = useState(5);
  const [estimatedWaitLoading, setEstimatedWaitLoading] = useState(false);


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
        showFeedback("Your session has expired. Please log in again.");
        window.location.reload();
        return;
      }

      showFeedback(data.message || data.error || "Failed to fetch tickets", "error");
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
      showFeedback("You must be logged in");
      return;
    }

    if (!selectedBusinessForTicket) {
      showFeedback("Please select a business");
      return;
    }

    if (!ticketMessage.trim()) {
      showFeedback("Please write a message");
      return;
    }

    const res = await createTicket({
      user: user._id,
      business: selectedBusinessForTicket._id,
      message: ticketMessage,
    });

    console.log("Saved:", res);

    if (res.error) {
      showFeedback(res.error, "error");
      return;
    }

    setTicketMessage("");
    setSelectedBusinessForTicket(null);
    setShowTicketModal(false);
    setEstimatedWaitBeforeSubmit(5);
    setEstimatedWaitLoading(false);


    await fetchMyTickets();

    showFeedback("Ticket created", "success");
  };

  const handleCancel = async (id) => {
    const res = await cancelTicket(id);

    if (res.error) {
      showFeedback(res.error, "error");
      return;
    }

    await fetchMyTickets();
    showFeedback("Ticket cancelled", "success");
  };

const openEditModal = (ticket) => {
  setEditModalTicket(ticket);
  setEditTicketMessage(ticket.message || "");
};

const closeEditModal = () => {
  setEditModalTicket(null);
  setEditTicketMessage("");
};

  const handleEditSubmit = async () => {
    if (!editModalTicket) return;

    if (!editTicketMessage.trim()) {
      showFeedback("Message is required", "error");
      return;
    }

    const res = await editTicket(editModalTicket._id, editTicketMessage.trim());

    if (res.error) {
      showFeedback(res.error, "error");
      return;
    }

    closeEditModal();
    await fetchMyTickets();
    showFeedback("Ticket updated", "success");
  };

  const allCurrentTickets = tickets.filter(
    (ticket) => ticket.status === "waiting" || ticket.status === "active"
  );

  const currentTicketBusinesses = [
    ...new Map(
      allCurrentTickets
        .filter((ticket) => ticket.business?._id)
        .map((ticket) => [ticket.business._id, ticket.business])
    ).values(),
  ];

  const currentTickets = ticketBusinessFilter
    ? allCurrentTickets.filter(
        (ticket) => ticket.business?._id === ticketBusinessFilter
      )
    : allCurrentTickets;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };

  const getBusinessIcon = (businessName = "") => {
    const name = businessName.toLowerCase();

    if (name.includes("bank")) return "🏦";
    if (name.includes("barber")) return "✂️";
    if (name.includes("hospital")) return "✚";
    if (name.includes("police")) return "🚔";
    if (name.includes("library")) return "📚";
    if (name.includes("phone")) return "📱";
    if (name.includes("gym")) return "🏋️";
    if (name.includes("post")) return "📦";
    if (name.includes("restaurant")) return "🍽️";
    if (name.includes("dental")) return "🦷";
    if (name.includes("museum")) return "🖼️";
    if (name.includes("bmw")) return "🚗";


    return "🏢";
  };

  const getBusinessCategory = (businessName = "") => {
    const name = businessName.toLowerCase();


    if (name.includes("bank")) return "Banking & Financial Services";
    if (name.includes("barber")) return "Personal Care & Grooming";
    if (name.includes("hospital")) return "Healthcare & Medical Services";
    if (name.includes("police")) return "Government & Public Safety";
    if (name.includes("library")) return "Public Services & Education";
    if (name.includes("phone")) return "Technology & Support";
    if (name.includes("gym")) return "Fitness & Membership";
    if (name.includes("post")) return "Delivery & Mail Services";
    if (name.includes("restaurant")) return "Food & Dining";
    if (name.includes("dental")) return "Healthcare & Dental Services";
    if (name.includes("museum")) return "Culture & Events";

    if (name.includes("bmw")) return "Vehicle Services";


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
    setEstimatedWaitBeforeSubmit(5);
      setEstimatedWaitLoading(false);

  };

  const fetchEstimatedWaitForBusiness = async (businessId) => {
    if (!businessId) {
      setEstimatedWaitBeforeSubmit(5);
      return;
    }

    setEstimatedWaitLoading(true);


    const res = await getEstimatedWaitForBusiness(businessId);

    if (!res.success) {
      setEstimatedWaitBeforeSubmit(5);
        setEstimatedWaitLoading(false);

      return;
    }

    setEstimatedWaitBeforeSubmit(res.estimatedWaitTime);
      setEstimatedWaitLoading(false);

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
        <p className={`toast-message ${feedbackType}`}>
          {feedbackMessage}
        </p>
      )}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Customer Dashboard</h2>
      </div>
      <section className="dashboard-section business-discovery">
        <div className="business-discovery-header">
          <h3 className="section-title">Find a Business</h3>

          <button
            className="dashboard-button secondary"
            type="button"
            onClick={() => setShowBusinesses(!showBusinesses)}
          >
            {showBusinesses ? "Hide businesses" : "Show businesses"}
          </button>
        </div>

      {showBusinesses && (
        <>
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
                  fetchEstimatedWaitForBusiness(business._id);
                }}
              >
                <div className="business-option-icon">
                  {getBusinessIcon(business.name)}
                </div>

                <div className="business-option-content">
                  <h4>{business.name}</h4>
                  <p>{getBusinessCategory(business.name)}</p>
                </div>

                <span className="business-option-arrow">
                  <span className="business-option-arrow-icon">›</span>
                </span>
              </button>
            ))}
          </div>

          {filteredBusinesses.length === 0 && (
            <p className="empty-message">No businesses match your search.</p>
          )}
        </>
      )}
      </section>

       {currentTicketBusinesses.length > 0 && (
        <section className="dashboard-section">
          <h3 className="section-title">Filter Tickets</h3>

          <div className="form-card">
            <div className="form-group">
              <select
                className="dashboard-select"
                value={ticketBusinessFilter}
                onChange={(e) => setTicketBusinessFilter(e.target.value)}
              >
                <option value="">All businesses</option>

                {currentTicketBusinesses.map((business) => (
                  <option key={business._id} value={business._id}>
                    {business.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      )}

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
                    <div className="ticket-actions">
                      <button
                        className="dashboard-button secondary"
                        onClick={() => openEditModal(t)}
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


      {showTicketModal && selectedBusinessForTicket && (
        <div className="modal-overlay">
          <div className="ticket-modal">
            <button
              className="modal-close-button"
              type="button"
              onClick={closeTicketModal}
            >
              <span className="modal-close-icon">×</span>
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

            <div className="estimated-wait-preview">
              <span>Estimated wait</span>
              <strong>
                {estimatedWaitLoading
                  ? "Calculating..."
                  : `${estimatedWaitBeforeSubmit} minutes`}
              </strong>
            </div>

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
      {editModalTicket && (
        <div className="modal-overlay">
          <div className="ticket-modal">
            <button
              className="modal-close-button"
              type="button"
              onClick={closeEditModal}
            >
              <span className="modal-close-icon">×</span>
            </button>

            <div className="ticket-modal-header">
              <div>
                <h3>Edit ticket</h3>
                <p>{editModalTicket.business?.name || "Selected business"}</p>
              </div>
            </div>

            <p className="modal-helper-text">
              Update your ticket message before your turn starts.
            </p>

            <div className="form-group">
              <label>Message</label>

              <textarea
                className="dashboard-textarea"
                placeholder="Update your ticket message..."
                value={editTicketMessage}
                onChange={(e) => setEditTicketMessage(e.target.value)}
                maxLength={500}
              />

              <p className="helper-text">{editTicketMessage.length} / 500</p>
            </div>

            <div className="ticket-actions modal-actions">
              <button
                className="dashboard-button"
                type="button"
                onClick={handleEditSubmit}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customer;