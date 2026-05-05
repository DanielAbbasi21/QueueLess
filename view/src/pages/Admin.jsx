import { useEffect, useState } from "react";
import { getTickets, startTicket, doneTicket } from "../services/api";

function Admin() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getTickets().then(data => setTickets(data));
  }, []);

  const handleStart = async (id) => {
    await startTicket(id);
    getTickets().then(setTickets);
  };

  const handleDone = async (id) => {
    await doneTicket(id);
    getTickets().then(setTickets);
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      {tickets.map((t) => (
        <div key={t.id}>
          <p><b>User:</b> {t.user}</p>
          <p><b>Business:</b> {t.business}</p>
          <p><b>Message:</b> {t.message}</p>
          <p><b>Status:</b> {t.status}</p>

          <button onClick={() => handleStart(t.id)}>
            Start
          </button>

          <button onClick={() => handleDone(t.id)}>
            Done
          </button>
          
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Admin;
