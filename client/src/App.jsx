import { useState } from "react";
import Login from "./pages/Login";
import Customer from "./pages/Customer";
import Admin from "./pages/Admin";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );


  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div>
      {user.role === "customer" && <Customer />}

      {user.role === "business" && <Admin />}

      {!["customer", "business"].includes(user.role) && (
        <p>Unknown user role</p>
      )}
    </div>
  );
}

export default App;