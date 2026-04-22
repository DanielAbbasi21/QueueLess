import { useState } from "react";
import Login from "./pages/Login";
import Customer from "./pages/Customer";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  return (
    <div>
      {user ? <Customer /> : <Login setUser={setUser} />}
    </div>
  );
}

export default App;