import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import NotificationToast from "../components/NotificationToast";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [project, setProject] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });

  // 🧠 Detect role from stored user info
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const role = storedUser.role || "freelancer";
  const username = storedUser.username || "Guest";

  // 🎨 Toggle dark mode theme
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, [darkMode]);

  // 📤 Handle Project Submission
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    try {
      // Example: connect this with your backend API later
      setToast("✅ Project posted successfully!");
      localStorage.setItem("projectDraft", JSON.stringify(project));
      setShowModal(false);
      setProject({ title: "", description: "", budget: "", deadline: "" });
    } catch (error) {
      console.error(error);
      setToast("🚨 Failed to post project!");
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.clear();
    setToast("👋 Logged out successfully!");
    setTimeout(() => navigate("/login"), 1000);
  };

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      <motion.h1
        className="dashboard-title"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🚀 Welcome, {username}
      </motion.h1>

      <p className="dashboard-subtitle">
        {role === "client"
          ? "Manage your projects and proposals seamlessly."
          : "Track your freelance work and explore opportunities."}
      </p>

      {/* ===== Control Buttons ===== */}
      <div style={{ marginBottom: "30px", display: "flex", justifyContent: "center", gap: "15px" }}>
        <button className="dashboard-btn" onClick={() => navigate(`/${role}-dashboard`)}>
          📊 Go to {role === "client" ? "Client" : "Freelancer"} Dashboard
        </button>
        {role === "client" && (
          <button className="dashboard-btn" onClick={() => setShowModal(true)}>
            ➕ Quick Post Project
          </button>
        )}
        <button
          className="dashboard-btn"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
        <button className="dashboard-btn cancel" onClick={handleLogout}>
          🔓 Logout
        </button>
      </div>

      {/* ===== Dashboard Metrics ===== */}
      <div className="dashboard-cards">
        <motion.div whileHover={{ scale: 1.05 }} className="dashboard-card">
          <h3>💰 Earnings</h3>
          <p>₹12,500 this month</p>
          <button className="dashboard-btn">View Details</button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="dashboard-card">
          <h3>📁 Active Projects</h3>
          <p>5 ongoing projects</p>
          <button
            className="dashboard-btn"
            onClick={() => navigate(`/${role}-dashboard`)}
          >
            See Projects
          </button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="dashboard-card">
          <h3>⭐ Rating & Reviews</h3>
          <p>4.8 / 5 average</p>
          <button className="dashboard-btn">View Feedback</button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="dashboard-card">
          <h3>💬 Messages</h3>
          <p>No new messages</p>
          <button className="dashboard-btn" onClick={() => navigate("/chat")}>
            Open Chat
          </button>
        </motion.div>
      </div>

      {/* ===== Modal for Quick Project Posting ===== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3>📝 Quick Post Project</h3>
            <form className="apply-form" onSubmit={handleSubmitProject}>
              <label>Project Title</label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                required
              />

              <label>Description</label>
              <input
                type="text"
                value={project.description}
                onChange={(e) =>
                  setProject({ ...project, description: e.target.value })
                }
                required
              />

              <label>Budget (₹)</label>
              <input
                type="number"
                value={project.budget}
                onChange={(e) => setProject({ ...project, budget: e.target.value })}
                required
              />

              <label>Deadline</label>
              <input
                type="date"
                value={project.deadline}
                onChange={(e) =>
                  setProject({ ...project, deadline: e.target.value })
                }
              />

              <div className="modal-buttons">
                <button type="button" className="dashboard-btn cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="dashboard-btn">
                  🚀 Post Project
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 🔔 Toast Notification */}
      {toast && <NotificationToast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}

export default Dashboard;
