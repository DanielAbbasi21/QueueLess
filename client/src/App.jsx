import Register from "./pages/Register";
import { useState } from "react";
import Login from "./pages/Login";
import Customer from "./pages/Customer";
import Business from "./pages/Business";
import Account from "./pages/Account";

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
    <button onClick={() => setPage("dashboard")}>Dashboard</button>
    <button onClick={() => setPage("account")}>Account</button>

    {page === "account" && <Account />}

    {page === "dashboard" && user.role === "customer" && <Customer />}

    {page === "dashboard" && user.role === "business" && <Business />}

    {!["customer", "business"].includes(user.role) && (
      <p>Unknown user role</p>
    )}
  </div>
);
}

export default App;