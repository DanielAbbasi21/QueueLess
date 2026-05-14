import { useEffect, useState } from "react";
import {
  getAdminStats,
  getAdminUsers,
  getAdminBusinesses,
  getAdminTickets,
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

  const showFeedback = (message, type = "error") => {
    setFeedbackMessage(message);
    setFeedbackType(type);

    setTimeout(() => {
      setFeedbackMessage("");
      setFeedbackType("");
    }, 3500);
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
            className="admin-refresh-button"
            type="button"
            onClick={() => fetchAdminData(ticketStatusFilter)}
            title="Refresh data"
        >
            <span className="admin-refresh-icon">⟳</span>
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
                <div className="admin-table-row" key={user._id}>
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
                <span>Tickets</span>
              </div>

              {filteredBusinesses.map((business) => (
                <div className="admin-table-row" key={business._id}>
                  <span>{business.name}</span>
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
    </div>
  );
}

export default Admin;