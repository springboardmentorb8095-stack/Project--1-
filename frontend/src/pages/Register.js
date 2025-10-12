import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

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
      const res = await axios.post("http://127.0.0.1:8000/api/register/", {
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
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      <a className="link" href="/login">Already have an account? Login</a>
    </div>
  );
}
