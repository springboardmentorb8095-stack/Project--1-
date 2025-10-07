import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // use your existing CSS for styling

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer"); // Default role

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulated login logic (you can later replace this with Django API)
    const user = { username, role };

    // Save user info to localStorage (optional)
    localStorage.setItem("user", JSON.stringify(user));

    // Redirect based on role
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
      </form>
    </div>
  );
}

export default LoginPage;
