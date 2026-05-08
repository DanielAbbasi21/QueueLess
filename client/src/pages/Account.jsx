import { useEffect, useState } from "react";
import { getMe } from "../services/api";

function Account() {
  const [user, setUser] = useState(null);

  const fetchAccount = async () => {
    const res = await getMe();

    if (!res.success) {
      alert(res.message || "Failed to fetch account");
      return;
    }

    setUser(res.user);
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  if (!user) {
    return <p>Loading account...</p>;
  }

  return (
    <div>
      <h2>Account</h2>

      <p>
        <b>Name:</b> {user.name}
      </p>

      <p>
        <b>Email:</b> {user.email}
      </p>

      <p>
        <b>Role:</b> {user.role}
      </p>

      {user.role === "business" && (
        <p>
          <b>Business:</b> {user.business?.name}
        </p>
      )}
    </div>
  );
}

export default Account;