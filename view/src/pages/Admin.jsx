import { useEffect, useState } from "react";
import {
  getTickets,
  getBusinesses,
  startTicket,
  doneTicket,
} from "../services/api";

function Admin() {
  const [tickets, setTickets] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState("");

  const fetchTickets = async () => {
    const data = await getTickets(selectedBusiness);
    setTickets(data);
  };

  const fetchBusinesses = async () => {
    const data = await getBusinesses();
    setBusinesses(data);
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [selectedBusiness]);

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

  return (
    <div>
      <h2>Admin Panel</h2>

      <select
        value={selectedBusiness}
        onChange={(e) => setSelectedBusiness(e.target.value)}
      >
        <option value="">All businesses</option>

        {businesses.map((b) => (
          <option key={b._id} value={b._id}>
            {b.name}
          </option>
        ))}
      </select>

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

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Admin;
