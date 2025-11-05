import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NotificationToast from "../components/NotificationToast";
import "./Auth.css";

const API_ROOT = process.env.REACT_APP_API_ROOT || "http://127.0.0.1:8000";

function LoginPage() {
  const navigate = useNavigate();

  // ---------- States ----------
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    remember: false,
    role: "freelancer",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // ---------- Handlers ----------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials({
      ...credentials,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setToast("");

    if (!credentials.username || !credentials.password) {
      setErrors({ form: "Username and password are required" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_ROOT}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Invalid credentials");

      // Save token & user info
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("username", credentials.username);
      localStorage.setItem("role", credentials.role);

      // User role decides dashboard
      const userObj = {
        username: credentials.username,
        email: `${credentials.username}@example.com`,
        role: credentials.role,
      };
      localStorage.setItem("user", JSON.stringify(userObj));

      setToast("✅ Login successful!");

      // Redirect after short delay
      setTimeout(() => {
        if (credentials.role === "client") navigate("/client-dashboard");
        else navigate("/freelancer-dashboard");
      }, 1200);
    } catch (err) {
      console.error("Login error:", err);
      setErrors({ form: err.message });
      setToast("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = () => {
    if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      setToast("⚠️ Enter a valid email address");
      return;
    }
    setToast("📩 Password reset link sent!");
    setShowForgot(false);
    setForgotEmail("");
  };

  // ---------- Google / GitHub ----------
  const handleGoogleLogin = () => {
    window.location.href = `${API_ROOT}/accounts/google/login/`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_ROOT}/accounts/github/login/`;
  };

  // ---------- UI ----------
  return (
    <div className="auth-container">
      {/* Background gradient */}
      <div className="auth-bg"></div>

      <motion.div
        className="auth-card glassy"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="auth-title">🔑 Welcome Back</h2>
        <p className="subtitle">Sign in to your TalentLink account</p>

        {errors.form && <p className="error-text">{errors.form}</p>}

        <form className="auth-form" onSubmit={handleLogin}>
          {/* Role Selector */}
          <div className="input-group">
            <select
              name="role"
              value={credentials.role}
              onChange={handleChange}
              className="role-select"
            >
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>
          </div>

          {/* Username */}
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="👤 Username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="🔒 Password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <span
              className="eye-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Remember + Forgot */}
          <div className="auth-options">
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={credentials.remember}
                onChange={handleChange}
              />
              Remember me
            </label>
            <button
              type="button"
              className="forgot-btn"
              onClick={() => setShowForgot(true)}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`login-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "⏳ Logging in..." : "Login"}
          </button>

          {/* Divider */}
          <div className="or-divider">or continue with</div>

          {/* Social buttons */}
          <div className="social-buttons">
            <button
              type="button"
              className="social-btn google"
              onClick={handleGoogleLogin}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
                alt="Google"
              />
              Google
            </button>
            <button
              type="button"
              className="social-btn github"
              onClick={handleGithubLogin}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733553.png"
                alt="GitHub"
              />
              GitHub
            </button>
          </div>

          {/* Register link */}
          <p className="register-text">
            Don’t have an account?{" "}
            <Link to="/register" className="register-link">
              Register here
            </Link>
          </p>
        </form>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgot && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForgot(false)}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>🔐 Forgot Password</h3>
              <p>Enter your registered email and we’ll send a reset link.</p>
              <input
                type="email"
                placeholder="📧 Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowForgot(false)}
                >
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleForgotSubmit}>
                  Send Link
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      {toast && <NotificationToast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}

export default LoginPage;
