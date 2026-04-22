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

export const getBusinesses = async () => {
  const res = await fetch(`${API}/businesses`);
  return res.json();
};
