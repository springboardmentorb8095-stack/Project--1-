// src/pages/ClientDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import "./ClientDashboard.css";

function ClientDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState({ project: "", rating: 0, comment: "" });

  const [user] = useState(
    JSON.parse(localStorage.getItem("user")) || { username: "Client" }
  );

  // ✅ Load data from localStorage
  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("clientProjects")) || [];
    setProjects(storedProjects);

    const storedReviews = JSON.parse(localStorage.getItem("clientReviews")) || [
      {
        project: "TalentLink UI Design",
        rating: 5,
        comment: "Amazing freelancer! Very professional and met all deadlines.",
      },
      {
        project: "Web App Development",
        rating: 4,
        comment: "Good communication and solid work quality.",
      },
    ];
    setReviews(storedReviews);

    const storedNotifications =
      JSON.parse(localStorage.getItem("clientNotifications")) || [
        {
          type: "update",
          message: "Freelancer John submitted a new proposal for your project.",
          time: "2 hours ago",
        },
        {
          type: "payment",
          message: "Payment milestone released successfully.",
          time: "Yesterday",
        },
      ];
    setNotifications(storedNotifications);
  }, []);

  // ✅ Handle Add Review (creates freelancer notification too)
  const handleAddReview = () => {
    if (!newReview.project || !newReview.rating || !newReview.comment.trim()) {
      alert("Please fill all fields before submitting!");
      return;
    }

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem("clientReviews", JSON.stringify(updatedReviews));

    // Create notification for Freelancer
    const freelancerNotifications =
      JSON.parse(localStorage.getItem("freelancerNotifications")) || [];
    freelancerNotifications.push({
      type: "review",
      message: `⭐ You received a ${newReview.rating}-star review for "${newReview.project}"`,
      time: new Date().toLocaleString(),
    });
    localStorage.setItem("freelancerNotifications", JSON.stringify(freelancerNotifications));

    // Client sees confirmation
    const updatedClientNotifications = [
      {
        type: "review",
        message: `You added a review for "${newReview.project}"`,
        time: "Just now",
      },
      ...notifications,
    ];
    setNotifications(updatedClientNotifications);
    localStorage.setItem("clientNotifications", JSON.stringify(updatedClientNotifications));

    setNewReview({ project: "", rating: 0, comment: "" });
    setShowModal(false);
  };

  return (
    <div className="dashboard-container">
      {/* ===== Sidebar ===== */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-avatar">
            <img
              src="https://cdn-icons-png.flaticon.com/512/219/219983.png"
              alt="Client Avatar"
            />
          </div>
          <div>
            <h2>{user.username}</h2>
            <p>Client</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => navigate("/client-dashboard")}>📊 Dashboard</button>
          <button onClick={() => navigate("/post-project")}>➕ Post Project</button>
          <button onClick={() => navigate("/my-projects")}>📁 My Projects</button>
          <button onClick={() => navigate("/contracts")}>📜 Contracts</button>
          <button onClick={() => navigate("/chat")}>💬 Messages</button>
        </nav>
      </aside>

      {/* ===== Main ===== */}
      <main className="dashboard-main">
        {/* Header with Notifications Icon */}
        <header className="dashboard-header">
          <div>
            <h1>👋 Welcome back, {user.username}</h1>
            <p className="subtitle">Here’s an overview of your hiring activity.</p>
          </div>
          <div className="header-actions">
            <button
              className="icon-btn"
              title="View Notifications"
              onClick={() => navigate("/client-notifications")}
            >
              <Bell size={24} />
              {notifications.length > 0 && (
                <span className="badge">{notifications.length}</span>
              )}
            </button>
            <button className="btn-primary" onClick={() => navigate("/my-profile")}>
              ✏️ Edit Profile
            </button>
          </div>
        </header>

        {/* ===== Metrics ===== */}
        <section className="dashboard-metrics">
          <motion.div whileHover={{ scale: 1.05 }} className="metric-card gradient-blue">
            <h3>📂 Total Projects</h3>
            <p>{projects.length}</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="metric-card gradient-green">
            <h3>🟢 Active Projects</h3>
            <p>{projects.filter((p) => p.status === "Active").length}</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="metric-card gradient-purple">
            <h3>📜 Contracts Created</h3>
            <p>{projects.filter((p) => p.status === "Contract").length}</p>
          </motion.div>
        </section>

        {/* ===== Project Section ===== */}
        <section className="dashboard-grid">
          <div className="dashboard-card">
            <h3>📁 My Projects</h3>
            {projects.length === 0 ? (
              <p className="empty-text">No projects posted yet.</p>
            ) : (
              <ul className="project-list">
                {projects.map((p, i) => (
                  <li key={i}>
                    <span>{p.title}</span>
                    <span className={`status ${p.status?.toLowerCase()}`}>{p.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="dashboard-card">
            <h3>⭐ Reviews & Feedback</h3>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              ✨ Add Review
            </button>
            <ul className="review-list">
              {reviews.map((r, i) => (
                <li key={i} className="review-item">
                  <div className="review-header">
                    <strong>{r.project}</strong>
                    <span>{"⭐".repeat(r.rating)}</span>
                  </div>
                  <p>{r.comment}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== Add Review Modal ===== */}
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="modal-content"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
            >
              <h2>📝 Give Review</h2>
              <label>Project Name:</label>
              <input
                type="text"
                value={newReview.project}
                onChange={(e) =>
                  setNewReview({ ...newReview, project: e.target.value })
                }
                placeholder="e.g. Portfolio Website"
              />

              <label>Rating:</label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= newReview.rating ? "active" : ""}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  >
                    ⭐
                  </span>
                ))}
              </div>

              <label>Feedback:</label>
              <textarea
                rows="3"
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                placeholder="Write your thoughts..."
              />

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleAddReview}>
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default ClientDashboard;
