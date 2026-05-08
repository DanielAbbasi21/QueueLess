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
    <div>
      <h2>Register</h2>


      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />


      <br />


      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />


      <br />


      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />


      <br />


      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="customer">Customer</option>
        <option value="business">Business</option>
      </select>


      <br />


      {role === "business" && (
        <>
          <input
            type="text"
            placeholder="Business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />


          <br />
        </>
      )}


      <button onClick={handleRegister}>Register</button>


      <p>
        Already have an account?{" "}
        <button onClick={() => setShowRegister(false)}>Login</button>
      </p>
    </div>
  );
}


export default Register;
