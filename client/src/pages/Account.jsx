import { useEffect, useState } from "react";
import { getMe } from "../services/api";

function Account() {
  const [user, setUser] = useState(null);

  const fetchAccount = async () => {
    const res = await getMe();

    if (!res.success) {
      alert(res.message || "Failed to fetch account");
      return;
    }

    setUser(res.user);
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  if (!user) {
    return <p>Loading account...</p>;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Account</h2>
        <p className="dashboard-subtitle">
          View your account information.
        </p>
      </div>


      <div className="account-card">
        <p>
          <b>Name:</b> {user.name}
        </p>


        <p>
          <b>Email:</b> {user.email}
        </p>


        <p>
          <b>Role:</b> {user.role}
        </p>


        {user.role === "business" && (
          <p>
            <b>Business:</b> {user.business?.name}
          </p>
        )}


        <button className="dashboard-button danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Account;