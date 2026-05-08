import { useEffect, useState } from "react";
import {
  getBusinessTickets,
  startTicket,
  doneTicket,
  cancelTicket,
} from "../services/api";

function Admin() {
  const [tickets, setTickets] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  
  const fetchTickets = async () => {
    if (!user?.business) return;

    const data = await getBusinessTickets();

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

  const activeTickets = tickets.filter((ticket) => ticket.status === "active");

  const waitingTickets = tickets.filter((ticket) => ticket.status === "waiting");

  const ticketHistory = tickets.filter(
    (ticket) => ticket.status === "done" || ticket.status === "cancelled"
  );

  return (
    <div>
      <h2>Business dashboard</h2>
      <button onClick={handleLogout}>Logout</button>


      <br /><br />

      {tickets.length === 0 && <p>No tickets found</p>}

      <h3>Active Customer</h3>

      {activeTickets.length === 0 && <p>No active customer.</p>}

      {activeTickets.map((t) => (
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

          {t.started_at && (
            <p>
              <b>Started:</b> {new Date(t.started_at).toLocaleString()}
            </p>
          )}

          <button onClick={() => handleDone(t._id)}>Done</button>

          <button onClick={() => handleCancel(t._id)}>Cancel</button>

          <hr />
        </div>
      ))}

      <h3>Current Queue</h3>

      {waitingTickets.length === 0 && <p>No waiting tickets.</p>}

      {waitingTickets.map((t) => (
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

          <p>
            <b>Created:</b> {new Date(t.created_at).toLocaleString()}
          </p>

          <button onClick={() => handleStart(t._id)}>Start</button>

          <button onClick={() => handleCancel(t._id)}>Cancel</button>

          <hr />
        </div>
      ))}

      <h3>Ticket History</h3>

      {ticketHistory.length === 0 && <p>No ticket history yet.</p>}

      {ticketHistory.map((t) => (
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

          <p>
            <b>Created:</b> {new Date(t.created_at).toLocaleString()}
          </p>

          {t.started_at && (
            <p>
              <b>Started:</b> {new Date(t.started_at).toLocaleString()}
            </p>
          )}

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

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Admin;
