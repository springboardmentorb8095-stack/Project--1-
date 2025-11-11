import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Both fields are required!");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("loggedUser", username);

      // fetch user profile
      const profileRes = await axios.get("http://127.0.0.1:8000/api/profiles/");
      const profile = profileRes.data.find((p) => p.user_name === username);

      setLoading(false);

      if (!profile) {
        alert("Profile not found!");
        navigate("/register");
        return;
      }

      localStorage.setItem("profileId", profile.id);

      // role check
      if (!profile.is_client && !profile.is_freelancer) {
        alert("Please select your role to continue!");
        navigate("/role");
      } else if (profile.is_freelancer) {
        navigate("/freelancer-dashboard");
      } else if (profile.is_client) {
        navigate("/client-dashboard");
      }
    } catch (error) {
      setLoading(false);
      alert("Login failed!");
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {loading ? (
        <p>⏳ Checking your profile...</p>
      ) : (
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </form>
      )}
      <a className="link" href="/register">
        Don’t have an account? Register
      </a>
    </div>
  );
}
