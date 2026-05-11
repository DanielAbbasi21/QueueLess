import { useState } from "react";
import { register } from "../services/api";


function Register({ setShowRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [businessName, setBusinessName] = useState("");


  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Name, email and password are required");
      return;
    }


    if (role === "business" && !businessName) {
      alert("Business name is required");
      return;
    }


    const res = await register({
      name,
      email,
      password,
      role,
      businessName: role === "business" ? businessName : undefined,
    });


    if (res.success) {
      alert("Account created. Please log in.");
      setShowRegister(false);
    } else {
      alert(res.message || "Failed to register");
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>
        <p className="auth-subtitle">Create your QueueLess account</p>

        <div className="auth-form">
          <div className="auth-field">
            <label>Name</label>
            <input
              className="auth-input"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Account type</label>
            <select
              className="auth-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customer">Customer</option>
              <option value="business">Business</option>
            </select>
          </div>

          {role === "business" && (
            <div className="auth-field">
              <label>Business name</label>
              <input
                className="auth-input"
                type="text"
                placeholder="Enter your business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
          )}

          <button className="auth-button" onClick={handleRegister}>
            Register
          </button>
        </div>

        <p className="auth-switch">
          Already have an account?{" "}
          <button
            className="auth-link-button"
            onClick={() => setShowRegister(false)}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}


export default Register;
