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
    getBusinesses().then(data => setBusinesses(data));
  }, []);

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await createTicket({                  
      user_id: user.id,                               
      business_id: selectedBusiness,                  
      message: message,                               
    });

    console.log("Saved:", res);                       

    setMessage("");                                   
    setSelectedBusiness("");                          
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
          <option key={b.id} value={b.id}>
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

      <button onClick={handleSubmit}>
        Submit Ticket
      </button>
      
    </div>
  );
}

export default Customer;
