import Register from "./pages/Register";
import { useState } from "react";
import Login from "./pages/Login";
import Customer from "./pages/Customer";
import Business from "./pages/Business";
import Account from "./pages/Account";
import Inbox from "./pages/Inbox";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [showRegister, setShowRegister] = useState(false);
  const [page, setPage] = useState("dashboard");


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
          Inbox
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