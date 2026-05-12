import Register from "./pages/Register";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Customer from "./pages/Customer";
import Business from "./pages/Business";
import Account from "./pages/Account";
import Inbox from "./pages/Inbox";
import { getUnreadNotificationCount } from "./services/api";


function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [showRegister, setShowRegister] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [unreadCount, setUnreadCount] = useState(0);

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


  if (!user) {
  return showRegister ? (
    <Register setShowRegister={setShowRegister} />
  ) : (
    <Login setUser={setUser} setShowRegister={setShowRegister} />
  );
}

  return (
  <div>
    <nav className="app-nav">
      <div className="app-brand">QueueLess</div>

      <div className="app-nav-actions">
        <button
          className={`nav-button ${page === "dashboard" ? "active" : ""}`}
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </button>
        
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


    {page === "account" && <Account />}

    {page === "inbox" && user.role === "customer" && <Inbox />}

    {page === "dashboard" && user.role === "customer" && <Customer />}

    {page === "dashboard" && user.role === "business" && <Business />}

    {!["customer", "business"].includes(user.role) && (
      <p>Unknown user role</p>
    )}
  </div>
);
}

export default App;