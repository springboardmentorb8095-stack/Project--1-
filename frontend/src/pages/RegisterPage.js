import React, { useState } from "react";
import "./Auth.css";  // ✅ import CSS

function RegisterPage() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
  const data = await response.json();
  alert(data.message);   // ✅ shows "User registered successfully!"
} else {
  const errData = await response.json();
  alert("❌ Registration failed: " + JSON.stringify(errData));
}
    } catch (error) {
      alert("⚠️ Network error: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h3>Register</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
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
          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}

export default RegisterPage;
