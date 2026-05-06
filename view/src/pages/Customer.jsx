import { useEffect, useState } from "react";
import { getBusinesses, createTicket } from "../services/api";

function Customer() {
  const [businesses, setBusinesses] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  useEffect(() => {
    getBusinesses().then((data) => setBusinesses(data));
  }, []);

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

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
    alert("Ticket created");
  };

  return (
    <div>
      <h2>Customer Page</h2>

      <button onClick={handleLogout}>Logout</button>

      <br /><br />

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
    </div>
  );
}

export default Customer;