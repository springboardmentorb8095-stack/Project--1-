import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
  navigate("/"); // always go home
};


  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Both fields are required!");
      return;
    }

    try {
      setLoading(true);

      // ✅ Step 1: Authenticate
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("loggedUser", username);

      // ✅ Step 2: Fetch profile details
      const profileRes = await axios.get("http://127.0.0.1:8000/api/profiles/");
      const profile = profileRes.data.find((p) => p.user_name === username);

      setLoading(false);

      if (!profile) {
        alert("Profile not found!");
        navigate("/register");
        return;
      }

      // ✅ Step 3: Store correct user details
      localStorage.setItem("profileId", profile.id);
      localStorage.setItem("profileName", profile.user_name);
    

      // ✅ Step 4: Role-specific storage (to avoid confusion in chat)
      if (profile.is_freelancer) {
        localStorage.setItem("freelancerProfileName", profile.user_name);
        localStorage.removeItem("clientProfileName");
        navigate("/freelancer-dashboard");
      } else if (profile.is_client) {
        localStorage.setItem("clientProfileName", profile.user_name);
        localStorage.removeItem("freelancerProfileName");
        navigate("/client-dashboard");
      } else {
        alert("Please select your role to continue!");
        navigate("/role");
      }
    } catch (error) {
      setLoading(false);
      alert("Login failed!");
      console.error(error.response?.data || error.message);
    }
  };

  return (
  <div className="login-wrapper-light">
    <div className="login-card-light">
      <h2>Welcome Back 👋</h2>

      {loading ? (
        <p>⏳ Checking your profile...</p>
      ) : (
        <form onSubmit={handleLogin}>
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
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="light-btn">
            Login
          </button>
        </form>
      )}

      <a className="switch-link-light" href="/register">
        Don’t have an account? <span>Register</span>
      </a>
    </div>
  </div>
);
}