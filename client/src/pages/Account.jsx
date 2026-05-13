import { useEffect, useState } from "react";
import { getMe } from "../services/api";

function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAccount = async () => {
    const res = await getMe();

    if (!res.success) {
      setLoading(false);
      alert(res.message || "Failed to fetch account");
      return;
    }

    setUser(res.user);
    setLoading(false);
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <p className="empty-message">Loading account...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-page">
        <p className="empty-message">No account information found.</p>
      </div>
    );
  }
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="dashboard-page account-page">
      <div className="account-header">
        <h2 className="dashboard-title">Account</h2>
        <p className="dashboard-subtitle">
          View your account information.
        </p>
      </div>

      <div className="account-card centered-account-card">
        <div className="account-avatar">
          {user.name?.charAt(0).toUpperCase()}
        </div>

        <h3 className="account-name">{user.name}</h3>

        <div className="account-info">
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
        </div>

        <button className="dashboard-button danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Account;