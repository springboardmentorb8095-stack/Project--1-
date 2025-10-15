import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔥 Call Django backend for JWT tokens
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Login success:", data);

        // ✅ Store tokens + user info
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("user", JSON.stringify({ username, role }));

        // 🔀 Redirect based on role
        if (role === "client") {
          navigate("/client-dashboard");
        } else {
          navigate("/freelancer-dashboard");
        }

        alert("✅ Login successful!");
      } else {
        const errorData = await response.json();
        console.error("❌ Login failed:", errorData);
        alert("❌ Invalid credentials. Please try again!");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("❌ Something went wrong. Try again later!");
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
