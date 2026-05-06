import { useEffect, useState } from "react";
import { getBusinesses, createTicket, getTickets } from "../services/api";

function Customer() {
  const [businesses, setBusinesses] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchMyTickets = async () => {
    if (!user) return;

    const data = await getTickets({ userId: user._id });
    setTickets(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  useEffect(() => {
    getBusinesses().then((data) => setBusinesses(data));
    fetchMyTickets();
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

  return (
    <div>
      <h2>Customer Page</h2>

      <button onClick={handleLogout}>Logout</button>

      <br /><br />

      <h3>Create Ticket</h3>

      <select
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

      <br /><br />

      <textarea
        placeholder="What do you need help with?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>Submit Ticket</button>

      <hr />

      <h3>My Tickets</h3>

      {tickets.length === 0 && <p>You have no tickets yet.</p>}

      {tickets.map((t) => (
        <div key={t._id}>
          <p>
            <b>Business:</b> {t.business?.name}
          </p>

          <p>
            <b>Message:</b> {t.message}
          </p>

          <p>
            <b>Status:</b> {t.status}
          </p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Customer;