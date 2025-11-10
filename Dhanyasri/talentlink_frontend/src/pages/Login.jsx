import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/Login.module.css";

const API_URL = "http://127.0.0.1:8000/api/accounts";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [role, setRole] = useState("client"); // default selected role
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        // Save tokens
        if (data.access && data.refresh) {
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);
        }

        // Save role for navbar detection
        localStorage.setItem(
          "is_freelancer",
          role === "freelancer" ? "true" : "false"
        );

        // Navigate based on role
        if (role === "client") navigate("/dashboard");
        else if (role === "freelancer") navigate("/freelancerdashboard");
        else navigate("/");
      } else {
        setError(data.detail || "Login failed. Please check credentials.");
        console.error("Backend error:", data);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2>LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles["form-group"]}>
            <label className={styles.inputLabel}>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className={styles["form-group"]}>
            <label className={styles.inputLabel}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <div className={styles["form-group"]}>
            <label className={styles.inputLabel}>Login as:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="client">Client</option>
              <option value="freelancer">Freelancer</option>
            </select>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
