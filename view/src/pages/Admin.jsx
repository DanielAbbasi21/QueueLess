import { useEffect, useState } from "react";
import { getTickets } from "../services/api";

function Admin() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getTickets().then(data => setTickets(data));
  }, []);

  return (
    <div>
      <h2>Admin Panel</h2>

      {tickets.map((t) => (
        <div key={t.id}>
          <p><b>User:</b> {t.user}</p>
          <p><b>Business:</b> {t.business}</p>
          <p><b>Message:</b> {t.message}</p>
          <p><b>Status:</b> {t.status}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Admin;
