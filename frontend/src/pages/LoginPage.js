import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // <-- Link import kiya
import "./Auth.css";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer");

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = { username, role };
    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "client") {
      navigate("/client-dashboard");
    } else {
      navigate("/freelancer-dashboard");
    }
  };

  return (
    <div className="auth-container">
      <h2>🔒 Login Page</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="role-select">
          <label>
            <input
              type="radio"
              value="client"
              checked={role === "client"}
              onChange={(e) => setRole(e.target.value)}
            />
            Client
          </label>
          <label>
            <input
              type="radio"
              value="freelancer"
              checked={role === "freelancer"}
              onChange={(e) => setRole(e.target.value)}
            />
            Freelancer
          </label>
        </div>

        <button type="submit">Login</button>

        {/* 👇 Add this link below the button */}
        <p style={{ marginTop: "10px" }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#007bff", textDecoration: "none" }}>
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
