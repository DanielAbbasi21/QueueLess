import { useEffect, useState } from "react";
import { getMe, deleteMyAccount } from "../services/api";


function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");


  const showFeedback = (message, type = "error") => {
    setFeedbackMessage(message);
    setFeedbackType(type);


    setTimeout(() => {
      setFeedbackMessage("");
      setFeedbackType("");
    }, 3500);
  };


  const fetchAccount = async () => {
    const res = await getMe();


    if (!res.success) {
      setLoading(false);
      showFeedback(res.message || "Failed to fetch account", "error");
      return;
    }


    setUser(res.user);
    setLoading(false);
  };


  useEffect(() => {
    fetchAccount();
  }, []);


  const handleLogout = () => {
    setShowLogoutModal(true);
  };


  const confirmLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };


  const confirmDeleteAccount = async () => {
    const res = await deleteMyAccount();


    if (!res.success) {
      showFeedback(res.message || res.error || "Failed to delete account", "error");
      return;
    }


    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };


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


  return (
    <div className="dashboard-page account-page">
      {feedbackMessage && (
        <div className={`toast-message ${feedbackType}`}>
          {feedbackMessage}
        </div>
      )}


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


        <div className="ticket-actions account-actions">
          <button className="dashboard-button danger" onClick={handleLogout}>
            Logout
          </button>


          <button
            className="dashboard-button danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete account
          </button>
        </div>
      </div>


      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="ticket-modal">
            <button
              className="modal-close-button"
              type="button"
              onClick={() => setShowLogoutModal(false)}
            >
              <span className="modal-close-icon">×</span>
            </button>


            <div className="ticket-modal-header">
              <div>
                <h3>Log out?</h3>
                <p>Are you sure you want to log out?</p>
              </div>
            </div>


            <p className="modal-helper-text">
              You will need to log in again to access your dashboard.
            </p>


            <div className="ticket-actions modal-actions">
              <button
                className="dashboard-button secondary"
                type="button"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>


              <button
                className="dashboard-button danger"
                type="button"
                onClick={confirmLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}


      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="ticket-modal">
            <button
              className="modal-close-button"
              type="button"
              onClick={() => setShowDeleteModal(false)}
            >
              <span className="modal-close-icon">×</span>
            </button>


            <div className="ticket-modal-header">
              <div>
                <h3>Delete account?</h3>
                <p>This action cannot be undone.</p>
              </div>
            </div>


            <p className="modal-helper-text">
              Are you sure you want to permanently delete your account and related data?
            </p>


            <div className="ticket-actions modal-actions">
              <button
                className="dashboard-button secondary"
                type="button"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>


              <button
                className="dashboard-button danger"
                type="button"
                onClick={confirmDeleteAccount}
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default Account;
