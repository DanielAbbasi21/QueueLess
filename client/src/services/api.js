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

export const getMe = async () => {
  const res = await fetch(`${API}/auth/me`, {
    headers: getAuthHeaders(),
  });

  return res.json();
};

export const register = async ({ name, email, password, role, businessName }) => {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      role,
      businessName,
    }),
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

export const getMyTickets = async () => {
  const res = await fetch(`${API}/tickets/my`, {
    headers: getAuthHeaders(),
  });

  return res.json();
};

export const getBusinessTickets = async () => {
  const res = await fetch(`${API}/tickets/business`, {
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

export const cancelTicket = async (id, reason = "") => {
  const res = await fetch(`${API}/tickets/cancel/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason }),
  });

  return res.json();
};

export const getBusinesses = async () => {
  const res = await fetch(`${API}/businesses`);
  return res.json();
};

export const getMyNotifications = async () => {
  const res = await fetch(`${API}/notifications/my`, {
    headers: getAuthHeaders(),
  });

  return res.json();
};

export const markNotificationAsRead = async (id) => {
  const res = await fetch(`${API}/notifications/read/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  return res.json();
};

export const getUnreadNotificationCount = async () => {
  const res = await fetch(`${API}/notifications/unread-count`, {
    headers: getAuthHeaders(),
  });

  return res.json();
};

export const warnCustomer = async ({ customer, ticket, reason }) => {
  const res = await fetch(`${API}/business-actions/warn`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      customer,
      ticket,
      reason,
    }),
  });

  return res.json();
};

export const blockCustomer = async ({ customer, ticket, reason }) => {
  const res = await fetch(`${API}/business-actions/block`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      customer,
      ticket,
      reason,
    }),
  });

  return res.json();
};

export const editTicket = async (id, message) => {
  const res = await fetch(`${API}/tickets/edit/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ message }),
  });

  return res.json();
};

export const unblockCustomer = async ({ customer }) => {
  const res = await fetch(`${API}/business-actions/unblock`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ customer }),
  });

  return res.json();
};

export const deleteMyAccount = async () => {
  const res = await fetch(`${API}/auth/me`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });


  return res.json();
};

export const getAdminStats = async () => {
  const res = await fetch(`${API}/admin/stats`, {
    headers: getAuthHeaders(),
  });

  return res.json();
};

export const getAdminUsers = async () => {
  const res = await fetch(`${API}/admin/users`, {
    headers: getAuthHeaders(),
  });

  return res.json();
};

export const getAdminBusinesses = async () => {
  const res = await fetch(`${API}/admin/businesses`, {
    headers: getAuthHeaders(),
  });

  return res.json();
};

export const getAdminTickets = async (status = "all") => {
  const res = await fetch(`${API}/admin/tickets?status=${status}`, {
    headers: getAuthHeaders(),
  });

  return res.json();
};

export const createAdminUser = async (userData) => {
  const res = await fetch(`${API}/admin/users`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });


  return res.json();
};

export const updateAdminUser = async (id, userData) => {
  const res = await fetch(`${API}/admin/users/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });


  return res.json();
};


export const updateAdminBusiness = async (id, businessData) => {
  const res = await fetch(`${API}/admin/businesses/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(businessData),
  });


  return res.json();
};

export const deleteAdminUser = async (id) => {
  const res = await fetch(`${API}/admin/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });


  return res.json();
};


export const deleteAdminBusiness = async (id) => {
  const res = await fetch(`${API}/admin/businesses/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });


  return res.json();
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  const res = await fetch(`${API}/auth/change-password`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  return res.json();
};