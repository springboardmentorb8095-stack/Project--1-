import React, { useState } from "react";
import "./Auth.css";  // ✅ import CSS

function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.access); // ✅ Save token
        alert("✅ Login successful!");
      } else {
        const errData = await response.json();
        alert("❌ Login failed: " + JSON.stringify(errData));
      }
    } catch (error) {
      alert("⚠️ Network error: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h3>Login</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
}

export default LoginPage;
