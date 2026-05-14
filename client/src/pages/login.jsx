import { useState } from "react";
import { login } from "../services/api";

function Login({ setUser, setShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const res = await login(email, password);

    if (res.success) {
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("token", res.token);
      setUser(res.user);
    } else {
      showFeedback(res.message || "Wrong login", "error");
    }
  };

  const showFeedback = (message, type = "error") => {
    setFeedbackMessage(message);
    setFeedbackType(type);


    setTimeout(() => {
      setFeedbackMessage("");
      setFeedbackType("");
    }, 3500);
  };

  
  return (
    <div className="auth-page">
      {feedbackMessage && (
        <div className={`toast-message ${feedbackType}`}>
          {feedbackMessage}
        </div>
      )}

      <div className="auth-wrapper">
        <img
          src="/queueless-logo.png"
          alt="QueueLess logo"
          className="auth-logo"
        />

        <div className="auth-card">
          <h2 className="auth-title">Login</h2>
          <p className="auth-subtitle">Welcome back to QueueLess</p>

          <div className="auth-form">
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
              <div className="password-field">
                <input
                  className="auth-input password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button className="auth-button" onClick={handleLogin}>
              Login
            </button>
          </div>

          <p className="auth-switch">
            Don't have an account?{" "}
            <button
              className="auth-link-button"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;