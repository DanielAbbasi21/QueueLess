import Register from "./pages/Register";
import { useState } from "react";
import Login from "./pages/Login";
import Customer from "./pages/Customer";
import Busniess from "./pages/Busniess";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [showRegister, setShowRegister] = useState(false);


  if (!user) {
  return showRegister ? (
    <Register setShowRegister={setShowRegister} />
  ) : (
    <Login setUser={setUser} setShowRegister={setShowRegister} />
  );
}

  return (
    <div>
      {user.role === "customer" && <Customer />}

      {user.role === "business" && <Busniess />}

      {!["customer", "business"].includes(user.role) && (
        <p>Unknown user role</p>
      )}
    </div>
  );
}

export default App;