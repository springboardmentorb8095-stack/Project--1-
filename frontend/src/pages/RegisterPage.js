import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "freelancer", // Default role
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulated user registration (later you’ll connect Django API here)
    console.log("Registered user:", formData);

    // Save user data (optional)
    localStorage.setItem("user", JSON.stringify(formData));

    // Redirect user after registration
    if (formData.role === "client") {
      navigate("/client-dashboard");
    } else {
      navigate("/freelancer-dashboard");
    }
  };

  return (
    <div className="auth-container">
      <h2>📝 Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="role-select">
          <label>
            <input
              type="radio"
              name="role"
              value="client"
              checked={formData.role === "client"}
              onChange={handleChange}
            />
            Client
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="freelancer"
              checked={formData.role === "freelancer"}
              onChange={handleChange}
            />
            Freelancer
          </label>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
