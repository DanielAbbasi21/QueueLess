const API = "http://localhost:3030";

export const login = async (email, password) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};

export const getTickets = async (businessId = "") => {
  const url = businessId
    ? `${API}/tickets?business=${businessId}`
    : `${API}/tickets`;

  const res = await fetch(url);
  return res.json();
};

export const createTicket = async (ticket) => {
  const res = await fetch(`${API}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticket),
  });

  return res.json();
};

export const startTicket = async (id) => {
  const res = await fetch(`${API}/tickets/start/${id}`, {
    method: "PUT",
  });

  return res.json();
};

export const doneTicket = async (id) => {
  const res = await fetch(`${API}/tickets/done/${id}`, {
    method: "PUT",
  });

  return res.json();
};

export const getBusinesses = async () => {
  const res = await fetch(`${API}/businesses`);
  return res.json();
};