import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "freelancer",
  });

  const [loading, setLoading] = useState(false); // ✅ loading state

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ start loading

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ User registered successfully:", data);
        localStorage.setItem("user", JSON.stringify(data));
        alert("Registration successful ✅");

        // Redirect based on role
        if (formData.role === "client") {
          navigate("/client-dashboard");
        } else {
          navigate("/freelancer-dashboard");
        }
      } else {
        console.error("❌ Registration failed:", data);
        alert("Registration failed: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("🚨 Error:", error);
      alert("Something went wrong while registering ❌");
    } finally {
      setLoading(false); // ✅ stop loading
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

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#007bff", textDecoration: "none" }}>
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
