import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import NotificationToast from "../components/NotificationToast";
import "./Auth.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "freelancer",
  });

  // ==========================
  // 🧠 Input Change + Password Strength
  // ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      const strength =
        (/[a-z]/.test(value) ? 1 : 0) +
        (/[A-Z]/.test(value) ? 1 : 0) +
        (/\d/.test(value) ? 1 : 0) +
        (/[@$!%*?&]/.test(value) ? 1 : 0);
      setPasswordStrength(strength);
    }
  };

  // ==========================
  // 🚀 Handle Register Submit
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast("");

    try {
      const res = await fetch("http://localhost:8000/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setToast("✅ Registered successfully!");
        localStorage.setItem(
          "user",
          JSON.stringify({ ...data, role: formData.role })
        );

        setTimeout(() => {
          navigate(
            formData.role === "client"
              ? "/client-profile"
              : "/freelancer-profile"
          );
        }, 1500);
      } else {
        setToast("❌ Registration failed! Check your inputs.");
      }
    } catch (error) {
      console.error(error);
      setToast("🚨 Server error while registering!");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // 🎨 Password Strength Bar
  // ==========================
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 1:
        return "#ef4444"; // red
      case 2:
        return "#f97316"; // orange
      case 3:
        return "#eab308"; // yellow
      case 4:
        return "#22c55e"; // green
      default:
        return "#cbd5e1"; // gray
    }
  };

  return (
    <div className="auth-container fade-in">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>🌟 Create Your Account</h2>
        <p className="subtitle">Join TalentLink and unlock opportunities!</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username */}
          <div className="relative">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="👤 Username"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="📧 Email Address"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="🔒 Password"
            />
            <span
              className="eye-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Password Strength Bar */}
          {formData.password && (
            <div
              style={{
                width: "100%",
                height: "6px",
                borderRadius: "5px",
                backgroundColor: "#e5e7eb",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: `${(passwordStrength / 4) * 100}%`,
                  backgroundColor: getStrengthColor(),
                  height: "100%",
                  borderRadius: "5px",
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>
          )}

          {/* Role Selection */}
          <div className="role-select">
            <label>
              <input
                type="radio"
                name="role"
                value="client"
                checked={formData.role === "client"}
                onChange={handleChange}
              />
              💼 Client
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="freelancer"
                checked={formData.role === "freelancer"}
                onChange={handleChange}
              />
              🧑‍💻 Freelancer
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`login-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "⏳ Registering..." : "🚀 Register"}
          </button>

          {/* Divider + Social Login */}
          <div className="social-login">
            <div className="or-divider">or continue with</div>
            <div className="social-buttons">
              <div className="social-btn google">
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                  alt="Google"
                />
                Google
              </div>
              <div className="social-btn github">
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                  alt="GitHub"
                />
                GitHub
              </div>
            </div>
          </div>

          {/* Link to Login */}
          <p className="register-text">
            Already have an account?{" "}
            <Link to="/login" className="register-link">
              Login here
            </Link>
          </p>
        </form>
      </motion.div>

      {toast && <NotificationToast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}

export default RegisterPage;
