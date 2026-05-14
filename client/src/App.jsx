import Register from "./pages/Register";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Customer from "./pages/Customer";
import Business from "./pages/Business";
import Account from "./pages/Account";
import Inbox from "./pages/Inbox";
import { getUnreadNotificationCount } from "./services/api";
import History from "./pages/History";
import Admin from "./pages/Admin";


function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [showRegister, setShowRegister] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const fetchUnreadCount = async () => {
  if (!user || user.role !== "customer") return;

  const res = await getUnreadNotificationCount();

  if (typeof res.count === "number") {
    setUnreadCount(res.count);
  }
};

  useEffect(() => {
    if (!user || user.role !== "customer") return;

    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (user?.role === "admin" && page === "dashboard") {
      setPage("admin");
    }
  }, [user, page]);

    if (!user) {
    return showRegister ? (
      <Register setShowRegister={setShowRegister} />
    ) : (
      <Login setUser={setUser} setShowRegister={setShowRegister} />
    );
  }

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="app-brand">
          <img src="/favicon.svg" alt="QueueLess logo" className="app-logo" />
          <span>QueueLess</span>
        </div>

        <div className="app-nav-actions">
          {user.role === "admin" ? (
            <button
              className={`nav-button ${page === "admin" ? "active" : ""}`}
              onClick={() => setPage("admin")}
            >
              Admin
            </button>
          ) : (
            <>
              <button
                className={`nav-button ${page === "dashboard" ? "active" : ""}`}
                onClick={() => setPage("dashboard")}
              >
                Dashboard
              </button>

              <button
                className={`nav-button ${page === "history" ? "active" : ""}`}
                onClick={() => setPage("history")}
              >
                History
              </button>
            </>
          )}
          
          {user.role === "customer" && (
            <button
              className={`nav-button ${page === "inbox" ? "active" : ""}`}
              onClick={() => setPage("inbox")}
            >
              Inbox {unreadCount > 0 && `(${unreadCount})`}
            </button>
          )}

            <button
              className={`nav-button ${page === "account" ? "active" : ""}`}
              onClick={() => setPage("account")}
            >
              Account
            </button>
          </div>
        </nav>

        <main className="app-main">

        {page === "admin" && user.role === "admin" && <Admin />}

        {page === "account" && <Account />}

        {page === "history" && user.role !== "admin" && <History user={user} />}

        {page === "inbox" && user.role === "customer" && <Inbox />}

        {page === "dashboard" && user.role === "customer" && <Customer />}

        {page === "dashboard" && user.role === "business" && <Business />}

        {!["customer", "business", "admin"].includes(user.role) && (
          <p>Unknown user role</p>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-left">
          <span>© 2026</span>
          <span>QueueLess</span>
        </div>

        <button
          className="footer-link"
          type="button"
          onClick={() => setShowAboutModal(true)}
        >
          About
        </button>
      </footer>

      {showAboutModal && (
        <div className="modal-overlay">
          <div className="ticket-modal about-modal">
            <button
              className="modal-close-button"
              type="button"
              onClick={() => setShowAboutModal(false)}
            >
              <span className="modal-close-icon">×</span>
            </button>

            <div className="about-modal-header">
              <img src="/favicon.svg" alt="QueueLess logo" />

              <div>
                <h3>About QueueLess</h3>
                <p>Digital queue management for customers and businesses.</p>
              </div>
            </div>

            <div className="about-modal-content">
              <p>
                QueueLess is a fullstack queue management app that makes waiting lines
                easier for customers and businesses.
              </p>

              <p>
                Customers can create a digital ticket, see their place in the queue,
                check the estimated wait time and get notifications when their turn is
                getting closer.
              </p>

              <p>
                Businesses can manage their queue in one place. They can start and
                complete tickets, cancel customers who do not show up, warn customers,
                block or unblock customers and view ticket history.
              </p>

              <p>
                QueueLess has role based login for customers and businesses, so each user
                gets the correct dashboard and tools.
              </p>

              <div className="about-info-grid">
                <div className="about-info-card">
                  <h4>Key features</h4>

                  <ul>
                    <li>Digital ticket creation</li>
                    <li>Queue position tracking</li>
                    <li>Estimated wait times</li>
                    <li>Business ticket management</li>
                    <li>Inbox notifications</li>
                    <li>Ticket history</li>
                    <li>Warning and block systems</li>
                    <li>Responsive design</li>
                  </ul>
                </div>

                <div className="about-info-card">
                  <h4>Built with</h4>

                  <ul>
                    <li>React</li>
                    <li>CSS</li>
                    <li>Node.js</li>
                    <li>Express</li>
                    <li>MongoDB</li>
                    <li>Mongoose</li>
                    <li>JWT authentication</li>
                  </ul>
                </div>
              </div>

              <div className="about-team-card">
                <h4>Our Team</h4>

                <div className="about-team-list">
                  <span>Mohammed Kawaf</span>
                  <span>Daniel Owliazadehabbasi</span>
                  <span>Mahmoud Nour</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;