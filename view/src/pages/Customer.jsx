import { useEffect, useState } from "react";
import { getBusinesses } from "../services/api";

function Customer() {
  const [businesses, setBusinesses] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  useEffect(() => {
    getBusinesses().then(data => setBusinesses(data));
  }, []);

  return (
    <div>
      <h2>Customer Page</h2>

      <button onClick={handleLogout}>Logout</button>

      <br /><br />

      <select>
        <option>Select a business</option>

        {businesses.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Customer;
