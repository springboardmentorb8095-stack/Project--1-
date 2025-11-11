import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import BASE_URL from "../apiConfig";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/register/`, {
        username,
        email,
        password,
      });

      alert("✅ Registered successfully! Please login now.");
      localStorage.setItem("registeredUser", username);
      localStorage.setItem("profileId", res.data.id);
      navigate("/login");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Registration failed! Try again.");
    }
  };

  return (
  <div className="login-wrapper-light">
    <div className="login-card-light">
      <h2>Create Account ✨</h2>

      <form onSubmit={handleRegister}>
        <div className="input-box-light">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-box-light">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-box-light">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="light-btn">
          Register
        </button>
      </form>

      <a className="switch-link-light" href="/login">
        Already have an account? <span>Login</span>
      </a>
    </div>
  </div>
);
}
    