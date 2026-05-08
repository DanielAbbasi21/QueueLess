import { useEffect, useState } from "react";
import {
  getTickets,
  startTicket,
  doneTicket,
  cancelTicket,
} from "../services/api";

function Admin() {
  const [tickets, setTickets] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  
  const fetchTickets = async () => {
    if (!user?.business) return;

    const data = await getTickets({ businessId: user.business });

    if (!Array.isArray(data)) {
      setTickets([]);
      alert(data.message || data.error || "Failed to fetch tickets");
      return;
    }

    setTickets(data);
  };
  

  useEffect(() => {
    fetchTickets();
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
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

  return (
    <div>
      <h2>Business dashboard</h2>
      <button onClick={handleLogout}>Logout</button>


      <br /><br />

      {tickets.length === 0 && <p>No tickets found</p>}

      {tickets.map((t) => (
        <div key={t._id}>
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

          <button
            onClick={() => handleStart(t._id)}
            disabled={t.status !== "waiting"}
          >
            Start
          </button>

          <button
            onClick={() => handleDone(t._id)}
            disabled={t.status !== "active"}
          >
            Done
          </button>

          <button
            onClick={() => handleCancel(t._id)}
            disabled={!["waiting", "active"].includes(t.status)}
          >
            Cancel
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Admin;
