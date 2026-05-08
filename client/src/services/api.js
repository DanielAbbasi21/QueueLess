const API = "http://localhost:3030";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

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

export const getTickets = async ({ businessId = "", userId = "" } = {}) => {
  const params = new URLSearchParams();

  if (businessId) {
    params.append("business", businessId);
  }

  if (userId) {
    params.append("user", userId);
  }

  const query = params.toString();
  const url = query ? `${API}/tickets?${query}` : `${API}/tickets`;

  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });

  return res.json();
};

export const createTicket = async (ticket) => {
  const res = await fetch(`${API}/tickets`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(ticket),
  });

  return res.json();
};

export const startTicket = async (id) => {
  const res = await fetch(`${API}/tickets/start/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  return res.json();
};

export const doneTicket = async (id) => {
  const res = await fetch(`${API}/tickets/done/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  return res.json();
};

export const cancelTicket = async (id) => {
  const res = await fetch(`${API}/tickets/cancel/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  return res.json();
};

export const getBusinesses = async () => {
  const res = await fetch(`${API}/businesses`);
  return res.json();
};
