import { useEffect, useState } from "react";
import {
  getAdminStats,
  getAdminUsers,
  getAdminBusinesses,
  getAdminTickets,
  createAdminUser,
  updateAdminUser,
  updateAdminBusiness
} from "../services/api";

function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [ticketStatusFilter, setTicketStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [businessSearch, setBusinessSearch] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createAccountForm, setCreateAccountForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    businessName: "",
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserForm, setEditUserForm] = useState({
    name: "",
    email: "",
    businessName: "",
    businessCategory: "",
  });


  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [editBusinessForm, setEditBusinessForm] = useState({
    name: "",
    category: "",
  });


  const showFeedback = (message, type = "error") => {
    setFeedbackMessage(message);
    setFeedbackType(type);

    setTimeout(() => {
      setFeedbackMessage("");
      setFeedbackType("");
    }, 3500);
  };

  const updateCreateAccountForm = (field, value) => {
  setCreateAccountForm((currentForm) => ({
    ...currentForm,
    [field]: value,
  }));
};


const closeCreateModal = () => {
  setShowCreateModal(false);
  setCreateAccountForm({
    name: "",
    email: "",
    password: "",
    role: "customer",
    businessName: "",
  });
};


const handleCreateAccount = async () => {
  if (
    !createAccountForm.name ||
    !createAccountForm.email ||
    !createAccountForm.password
  ) {
    showFeedback("Name, email and password are required", "error");
    return;
  }


  if (createAccountForm.role === "business" && !createAccountForm.businessName) {
    showFeedback("Business name is required", "error");
    return;
  }


  const res = await createAdminUser(createAccountForm);


  if (!res.success) {
    showFeedback(res.message || "Failed to create account", "error");
    return;
  }


  closeCreateModal();
  await fetchAdminData(ticketStatusFilter);
  showFeedback("Account created successfully", "success");
};

const openUserModal = (user) => {
  setSelectedUser(user);
  setEditUserForm({
    name: user.name || "",
    email: user.email || "",
    businessName: user.business?.name || "",
    businessCategory: user.business?.category || "Business Services",
  });
};


const closeUserModal = () => {
  setSelectedUser(null);
  setEditUserForm({
    name: "",
    email: "",
    businessName: "",
    businessCategory: "",
  });
};


const updateEditUserForm = (field, value) => {
  setEditUserForm((currentForm) => ({
    ...currentForm,
    [field]: value,
  }));
};


const handleUpdateUser = async () => {
  if (!selectedUser) return;


  if (!editUserForm.name || !editUserForm.email) {
    showFeedback("Name and email are required", "error");
    return;
  }


  if (selectedUser.role === "business" && !editUserForm.businessName) {
    showFeedback("Business name is required", "error");
    return;
  }


  const res = await updateAdminUser(selectedUser._id, editUserForm);


  if (!res.success) {
    showFeedback(res.message || "Failed to update account", "error");
    return;
  }


  closeUserModal();
  await fetchAdminData(ticketStatusFilter);
  showFeedback("Account updated successfully", "success");
};


const openBusinessModal = (business) => {
  setSelectedBusiness(business);
  setEditBusinessForm({
    name: business.name || "",
    category: business.category || "Business Services",
  });
};


const closeBusinessModal = () => {
  setSelectedBusiness(null);
  setEditBusinessForm({
    name: "",
    category: "",
  });
};


const updateEditBusinessForm = (field, value) => {
  setEditBusinessForm((currentForm) => ({
    ...currentForm,
    [field]: value,
  }));
};


const handleUpdateBusiness = async () => {
  if (!selectedBusiness) return;


  if (!editBusinessForm.name) {
    showFeedback("Business name is required", "error");
    return;
  }


  const res = await updateAdminBusiness(selectedBusiness._id, editBusinessForm);


  if (!res.success) {
    showFeedback(res.message || "Failed to update business", "error");
    return;
  }


  closeBusinessModal();
  await fetchAdminData(ticketStatusFilter);
  showFeedback("Business updated successfully", "success");
};

  const fetchAdminData = async (status = ticketStatusFilter) => {
      setLoading(true);

    const [statsRes, usersRes, businessesRes, ticketsRes] = await Promise.all([
      getAdminStats(),
      getAdminUsers(),
      getAdminBusinesses(),
      getAdminTickets(status),
    ]);

    if (!statsRes.success) {
      showFeedback(statsRes.message || "Failed to fetch admin stats", "error");
    }

    if (!usersRes.success) {
      showFeedback(usersRes.message || "Failed to fetch users", "error");
    }

    if (!businessesRes.success) {
      showFeedback(
        businessesRes.message || "Failed to fetch businesses",
        "error"
      );
    }

    if (!ticketsRes.success) {
      showFeedback(ticketsRes.message || "Failed to fetch tickets", "error");
    }

    setStats(statsRes.stats || null);
    setUsers(usersRes.users || []);
    setBusinesses(businessesRes.businesses || []);
    setTickets(ticketsRes.tickets || []);
    setLoading(false);
  };

    useEffect(() => {
        fetchAdminData(ticketStatusFilter);
    }, [ticketStatusFilter]);

  const handleTicketFilterChange = (status) => {
    setTicketStatusFilter(status);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

    const filteredUsers = users.filter((user) => {
    const search = userSearch.toLowerCase();

    return (
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.role?.toLowerCase().includes(search) ||
        user.business?.name?.toLowerCase().includes(search)
    );
    });

    const filteredBusinesses = businesses.filter((business) =>
    business.name?.toLowerCase().includes(businessSearch.toLowerCase())
    );

    const recentTickets = tickets.slice(0, 5);

    const ticketStatusData = stats
    ? [
        { label: "Waiting", value: stats.waitingTickets },
        { label: "Active", value: stats.activeTickets },
        { label: "Done", value: stats.doneTickets },
        { label: "Cancelled", value: stats.cancelledTickets },
        { label: "Blocked", value: stats.blockedTickets },
        ]
    : [];

    const maxTicketStatusValue = Math.max(
    ...ticketStatusData.map((item) => item.value),
    1
    );

  return (
    <div className="dashboard-page admin-page">
      {feedbackMessage && (
        <div className={`toast-message ${feedbackType}`}>
          {feedbackMessage}
        </div>
      )}

      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Admin Dashboard</h2>
        </div>

        <button
            className="dashboard-button"
            type="button"
            onClick={() => setShowCreateModal(true)}
        >
          Create account
        </button>
      </div>

      {loading && <p className="empty-message">Loading admin dashboard...</p>}

      {!loading && stats && (
        <section className="dashboard-section">
          <h3 className="section-title">System Statistics</h3>

          <div className="admin-stat-grid">
            <div className="admin-stat-card">
              <span>Total Users</span>
              <strong>{stats.totalUsers}</strong>
            </div>

            <div className="admin-stat-card">
              <span>Customers</span>
              <strong>{stats.totalCustomers}</strong>
            </div>

            <div className="admin-stat-card">
              <span>Business Users</span>
              <strong>{stats.totalBusinessUsers}</strong>
            </div>

            <div className="admin-stat-card">
              <span>Businesses</span>
              <strong>{stats.totalBusinesses}</strong>
            </div>

            <div className="admin-stat-card">
              <span>Total Tickets</span>
              <strong>{stats.totalTickets}</strong>
            </div>

            <div className="admin-stat-card">
              <span>Waiting</span>
              <strong>{stats.waitingTickets}</strong>
            </div>

            <div className="admin-stat-card">
              <span>Active</span>
              <strong>{stats.activeTickets}</strong>
            </div>

            <div className="admin-stat-card">
              <span>Done</span>
              <strong>{stats.doneTickets}</strong>
            </div>

            <div className="admin-stat-card">
              <span>Cancelled</span>
              <strong>{stats.cancelledTickets}</strong>
            </div>

            <div className="admin-stat-card">
              <span>Blocked</span>
              <strong>{stats.blockedTickets}</strong>
            </div>

            <div className="admin-stat-card">
              <span>Notifications</span>
              <strong>{stats.totalNotifications}</strong>
            </div>

            <div className="admin-stat-card">
              <span>Warnings</span>
              <strong>{stats.totalWarnings}</strong>
            </div>
          </div>
        </section>
      )}

      {!loading && stats && (
        <section className="dashboard-section">
            <h3 className="section-title">Ticket Status Overview</h3>

            <div className="admin-chart-card">
            {ticketStatusData.map((item) => (
                <div className="admin-chart-row" key={item.label}>
                <div className="admin-chart-label">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                </div>

                <div className="admin-chart-track">
                    <div
                    className="admin-chart-bar"
                    style={{
                        width: `${(item.value / maxTicketStatusValue) * 100}%`,
                    }}
                    ></div>
                </div>
                </div>
            ))}
            </div>
        </section>
        )}

      <section className="dashboard-section">
        <div className="admin-section-header">
            <h3 className="section-title">Users</h3>

            <input
            className="dashboard-input admin-search-input"
            type="text"
            placeholder="Search users..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            />
        </div>

        <div className="admin-table-card">
            {filteredUsers.length === 0 ? (
            <p className="empty-message">No users found.</p>
          ) : (
            <div className="admin-table">
              <div className="admin-table-row admin-table-head">
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
                <span>Business</span>
              </div>

              {filteredUsers.map((user) => (
                <div
                  className="admin-table-row admin-clickable-row"
                  key={user._id}
                  onClick={() => openUserModal(user)}
                >
                  <span>{user.name}</span>
                  <span>{user.email}</span>
                  <span>{user.role}</span>
                  <span>{user.business?.name || "-"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="admin-section-header">
            <h3 className="section-title">Businesses</h3>

            <input
            className="dashboard-input admin-search-input"
            type="text"
            placeholder="Search businesses..."
            value={businessSearch}
            onChange={(e) => setBusinessSearch(e.target.value)}
            />
        </div>

        <div className="admin-table-card">
            {filteredBusinesses.length === 0 ? (
            <p className="empty-message">No businesses found.</p>
          ) : (
            <div className="admin-table">
              <div className="admin-table-row admin-table-head">
                <span>Business</span>
                <span>Category</span>
                <span>Tickets</span>
              </div>

              {filteredBusinesses.map((business) => (
                <div
                  className="admin-table-row admin-clickable-row"
                  key={business._id}
                  onClick={() => openBusinessModal(business)}
                >
                  <span>{business.name}</span>
                  <span>{business.category || "Business Services"}</span>
                  <span>{business.ticketCount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="dashboard-section">
        <h3 className="section-title">Recent Activity</h3>

        <div className="admin-activity-card">
            {recentTickets.length === 0 ? (
            <p className="empty-message">No recent activity found.</p>
            ) : (
            recentTickets.map((ticket) => (
                <div className="admin-activity-item" key={ticket._id}>
                <div>
                    <strong>{ticket.user?.name || "Deleted user"}</strong>
                    <p>
                    {ticket.status} ticket at{" "}
                    {ticket.business?.name || "Deleted business"}
                    </p>
                </div>

                <span>{formatDate(ticket.created_at)}</span>
                </div>
                ))
            )}
            </div>
        </section>

      <section className="dashboard-section">
        <div className="admin-section-header">
          <h3 className="section-title">Tickets</h3>

          <select
            className="dashboard-select admin-filter-select"
            value={ticketStatusFilter}
            onChange={(e) => handleTicketFilterChange(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="waiting">Waiting</option>
            <option value="active">Active</option>
            <option value="done">Done</option>
            <option value="cancelled">Cancelled</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div className="admin-table-card">
          {tickets.length === 0 ? (
            <p className="empty-message">No tickets found for this filter.</p>
          ) : (
            <div className="admin-table admin-ticket-table">
              <div className="admin-table-row admin-table-head">
                <span>Customer</span>
                <span>Business</span>
                <span>Status</span>
                <span>Message</span>
                <span>Created</span>
              </div>

              {tickets.map((ticket) => (
                <div className="admin-table-row" key={ticket._id}>
                  <span>{ticket.user?.name || "Deleted user"}</span>
                  <span>{ticket.business?.name || "Deleted business"}</span>
                  <span>
                    <span className={`status-badge status-${ticket.status}`}>
                      {ticket.status}
                    </span>
                  </span>
                  <span>{ticket.message || "-"}</span>
                  <span>{formatDate(ticket.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="ticket-modal">
            <button
              className="modal-close-button"
              type="button"
              onClick={closeCreateModal}
            >
              <span className="modal-close-icon">×</span>
            </button>


            <div className="ticket-modal-header">
              <div>
                <h3>Create account</h3>
                <p>Create a new customer or business account.</p>
              </div>
            </div>


            <div className="form-group">
              <label>Name</label>
              <input
                className="dashboard-input"
                type="text"
                placeholder="Enter full name"
                value={createAccountForm.name}
                onChange={(e) => updateCreateAccountForm("name", e.target.value)}
              />


              <label>Email</label>
              <input
                className="dashboard-input"
                type="email"
                placeholder="Enter email"
                value={createAccountForm.email}
                onChange={(e) => updateCreateAccountForm("email", e.target.value)}
              />


              <label>Password</label>
              <input
                className="dashboard-input"
                type="password"
                placeholder="Enter password"
                value={createAccountForm.password}
                onChange={(e) => updateCreateAccountForm("password", e.target.value)}
              />


              <label>Role</label>
              <select
                className="dashboard-select"
                value={createAccountForm.role}
                onChange={(e) => updateCreateAccountForm("role", e.target.value)}
              >
                <option value="customer">Customer</option>
                <option value="business">Business</option>
              </select>


              {createAccountForm.role === "business" && (
                <>
                  <label>Business name</label>
                  <input
                    className="dashboard-input"
                    type="text"
                    placeholder="Enter business name"
                    value={createAccountForm.businessName}
                    onChange={(e) =>
                      updateCreateAccountForm("businessName", e.target.value)
                    }
                  />
                </>
              )}
            </div>


            <div className="ticket-actions modal-actions">
              <button
                className="dashboard-button"
                type="button"
                onClick={handleCreateAccount}
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="modal-overlay">
          <div className="ticket-modal">
            <button
              className="modal-close-button"
              type="button"
              onClick={closeUserModal}
            >
              <span className="modal-close-icon">×</span>
            </button>


            <div className="ticket-modal-header">
              <div>
                <h3>Edit account</h3>
                <p>
                  {selectedUser.role} account · {selectedUser.email}
                </p>
              </div>
            </div>


            <div className="form-group">
              <label>Name</label>
              <input
                className="dashboard-input"
                type="text"
                value={editUserForm.name}
                onChange={(e) => updateEditUserForm("name", e.target.value)}
              />


              <label>Email</label>
              <input
                className="dashboard-input"
                type="email"
                value={editUserForm.email}
                onChange={(e) => updateEditUserForm("email", e.target.value)}
              />


              <label>Role</label>
              <input
                className="dashboard-input"
                type="text"
                value={selectedUser.role}
                disabled
              />


              {selectedUser.role === "business" && (
                <>
                  <label>Business name</label>
                  <input
                    className="dashboard-input"
                    type="text"
                    value={editUserForm.businessName}
                    onChange={(e) => updateEditUserForm("businessName", e.target.value)}
                  />


                  <label>Business category</label>
                  <input
                    className="dashboard-input"
                    type="text"
                    value={editUserForm.businessCategory}
                    onChange={(e) =>
                      updateEditUserForm("businessCategory", e.target.value)
                    }
                  />
                </>
              )}
            </div>


            <div className="ticket-actions modal-actions">
              <button
                className="dashboard-button"
                type="button"
                onClick={handleUpdateUser}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedBusiness && (
        <div className="modal-overlay">
          <div className="ticket-modal">
            <button
              className="modal-close-button"
              type="button"
              onClick={closeBusinessModal}
            >
              <span className="modal-close-icon">×</span>
            </button>


            <div className="ticket-modal-header">
              <div>
                <h3>Edit business</h3>
                <p>Update business information.</p>
              </div>
            </div>


            <div className="form-group">
              <label>Business name</label>
              <input
                className="dashboard-input"
                type="text"
                value={editBusinessForm.name}
                onChange={(e) => updateEditBusinessForm("name", e.target.value)}
              />


              <label>Business category</label>
              <input
                className="dashboard-input"
                type="text"
                value={editBusinessForm.category}
                onChange={(e) => updateEditBusinessForm("category", e.target.value)}
              />
            </div>


            <div className="ticket-actions modal-actions">
              <button
                className="dashboard-button"
                type="button"
                onClick={handleUpdateBusiness}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;