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

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("📩 Backend Response:", data); // ✅ See actual error or success here

      if (response.ok) {
        alert("✅ Registration successful!");
        localStorage.setItem("user", JSON.stringify({ ...data, role: formData.role }));

        // ✅ Redirect based on role
        if (formData.role === "client") {
          navigate("/client-profile");
        } else {
          navigate("/freelancer-profile");
        }
      } else {
        console.error("❌ Registration failed:", data);
        alert(
          "Registration failed ❌\n" +
          (data?.detail || JSON.stringify(data))
        );
      }
    } catch (error) {
      console.error("🚨 Error during registration:", error);
      alert("Something went wrong while registering ❌");
    } finally {
      setLoading(false);
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
