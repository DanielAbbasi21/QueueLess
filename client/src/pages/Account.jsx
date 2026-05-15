import { useEffect, useState } from "react";
import { getMe, deleteMyAccount, changePassword } from "../services/api";


function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const updatePasswordForm = (field, value) => {
    setPasswordForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleChangePassword = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      showFeedback("All password fields are required", "error");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showFeedback("New password must be at least 6 characters long", "error");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showFeedback("New passwords do not match", "error");
      return;
    }

    const res = await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    if (!res.success) {
      showFeedback(res.message || "Failed to change password", "error");
      return;
    }

    closePasswordModal();
    showFeedback("Password changed successfully", "success");
  };


  return (
    <div className="dashboard-page account-page">
      {feedbackMessage && (
        <div className={`toast-message ${feedbackType}`}>
          {feedbackMessage}
        </div>
      )}


      <div className="account-header">
        <h2 className="dashboard-title">Account</h2>
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
          <button
            className="dashboard-button secondary"
            type="button"
            onClick={() => setShowPasswordModal(true)}
          >
            Change password
          </button>

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

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="ticket-modal">
            <button
              className="modal-close-button"
              type="button"
              onClick={closePasswordModal}
            >
              <span className="modal-close-icon">×</span>
            </button>

            <div className="ticket-modal-header">
              <div>
                <h3>Change password</h3>
                <p>Update your account password.</p>
              </div>
            </div>

            <p className="modal-helper-text">
              Use a strong password that you do not use on other websites.
            </p>

            <div className="form-group">
              <label>Current password</label>
              <div className="password-field">
                <input
                  className="dashboard-input password-input"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    updatePasswordForm("currentPassword", e.target.value)
                  }
                />

                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? "Hide" : "Show"}
                </button>
              </div>

              <label>New password</label>
              <div className="password-field">
                <input
                  className="dashboard-input password-input"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    updatePasswordForm("newPassword", e.target.value)
                  }
                />

                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>

              <label>Confirm new password</label>
              <div className="password-field">
                <input
                  className="dashboard-input password-input"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    updatePasswordForm("confirmPassword", e.target.value)
                  }
                />

                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="ticket-actions modal-actions">
              <button
                className="dashboard-button"
                type="button"
                onClick={handleChangePassword}
              >
                Save password
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
