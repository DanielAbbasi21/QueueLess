import { useState } from "react";
import Login from "./pages/Login";
import Customer from "./pages/Customer";
import Admin from "./pages/Admin";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [isAdmin, setIsAdmin] = useState(false);

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div>
      <button onClick={() => setIsAdmin(!isAdmin)}>
        Switch to {isAdmin ? "Customer" : "Admin"} View
      </button>

      {isAdmin ? <Admin /> : <Customer />}
    </div>
  );
}

export default App;