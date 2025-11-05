import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./MyProjects.css";

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Recent");
  const [selected, setSelected] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("clientProjects")) || [
      {
        title: "TalentLink Platform",
        budget: "₹20,000",
        skills: "React, Node.js",
        deadline: "2025-07-12",
        status: "Active",
        progress: 70,
        postedOn: "2025-06-15",
      },
      {
        title: "Portfolio Revamp",
        budget: "₹15,000",
        skills: "React, Tailwind, Firebase",
        deadline: "2025-11-30",
        status: "Posted",
        progress: 25,
        postedOn: "2025-10-30",
      },
      {
        title: "E-Commerce App",
        budget: "₹30,000",
        skills: "React Native, Firebase",
        deadline: "2025-09-01",
        status: "Completed",
        progress: 100,
        postedOn: "2025-05-01",
        rating: 4,
        review: "Freelancer delivered clean and efficient work!",
      },
    ];
    setProjects(stored);
  }, []);

  // --- Filter + Sort logic ---
  const filtered = projects
    .filter(
      (p) =>
        (filter === "All" || p.status === filter) &&
        p.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "Budget")
        return (
          parseInt(b.budget.replace(/[₹,]/g, "")) -
          parseInt(a.budget.replace(/[₹,]/g, ""))
        );
      if (sort === "Deadline")
        return new Date(a.deadline) - new Date(b.deadline);
      return new Date(b.postedOn) - new Date(a.postedOn);
    });

  // --- Project Operations ---
  const deleteProject = (title) => {
    const updated = projects.filter((p) => p.title !== title);
    setProjects(updated);
    localStorage.setItem("clientProjects", JSON.stringify(updated));
    setSelected(null);
  };

  const markAsCompleted = (title) => {
    const updated = projects.map((p) =>
      p.title === title ? { ...p, status: "Completed", progress: 100 } : p
    );
    setProjects(updated);
    localStorage.setItem("clientProjects", JSON.stringify(updated));
    setSelected(null);
  };

  const submitReview = () => {
    const updated = projects.map((p) =>
      p.title === selected.title
        ? { ...p, review: reviewText, rating: rating }
        : p
    );
    setProjects(updated);
    localStorage.setItem("clientProjects", JSON.stringify(updated));
    setSelected(null);
    setReviewText("");
    setRating(0);
  };

  return (
    <div className={`projects-container ${darkMode ? "dark" : ""}`}>
      {/* 🌈 Stats Section */}
      <motion.div
        className="stats-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {[
          {
            icon: "📊",
            label: "Total Projects",
            value: projects.length,
            class: "total",
          },
          {
            icon: "⚡",
            label: "Active",
            value: projects.filter((p) => p.status === "Active").length,
            class: "active",
          },
          {
            icon: "✅",
            label: "Completed",
            value: projects.filter((p) => p.status === "Completed").length,
            class: "completed",
          },
          {
            icon: "📝",
            label: "Posted",
            value: projects.filter((p) => p.status === "Posted").length,
            class: "posted",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className={`stat-card ${item.class}`}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
            transition={{ type: "spring", stiffness: 150 }}
          >
            <div className="stat-icon">{item.icon}</div>
            <div className="stat-value">{item.value}</div>
            <div className="stat-label">{item.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Header */}
      <motion.div
        className="projects-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>📁 My Projects</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="🔍 Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>Posted</option>
            <option>Active</option>
            <option>Completed</option>
          </select>
          <select onChange={(e) => setSort(e.target.value)}>
            <option>Recent</option>
            <option>Budget</option>
            <option>Deadline</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="create-btn"
            onClick={() => navigate("/post-project")}
          >
            ➕ Post New Project
          </motion.button>
          <button
            className="mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        layout
        className="projects-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {filtered.length === 0 ? (
          <p className="empty">No projects found 😅</p>
        ) : (
          filtered.map((p, i) => (
            <motion.div
              key={i}
              className={`project-card ${p.status.toLowerCase()}`}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 120 }}
              onClick={() => setSelected(p)}
            >
              <div className="card-header">
                <h3>{p.title}</h3>
                <span className={`status ${p.status.toLowerCase()}`}>
                  {p.status}
                </span>
              </div>
              <p><strong>💰 Budget:</strong> {p.budget}</p>
              <p><strong>🛠 Skills:</strong> {p.skills}</p>
              <p><strong>📅 Deadline:</strong> {p.deadline}</p>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${p.progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              {p.status === "Completed" && p.rating && (
                <p>⭐ {p.rating}/5 – “{p.review}”</p>
              )}
              <p className="progress-text">
                {p.progress === 100
                  ? "✅ Completed"
                  : `${p.progress}% Completed`}
              </p>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <h2>{selected.title}</h2>
              <p><strong>Budget:</strong> {selected.budget}</p>
              <p><strong>Skills:</strong> {selected.skills}</p>
              <p><strong>Deadline:</strong> {selected.deadline}</p>
              <p><strong>Status:</strong> {selected.status}</p>

              <div className="progress-bar large">
                <div
                  className="progress-fill"
                  style={{ width: `${selected.progress}%` }}
                ></div>
              </div>

              {selected.status === "Completed" && (
                <div className="review-section">
                  <h4>📝 Leave a Review</h4>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setRating(star)}
                        style={{
                          cursor: "pointer",
                          color: rating >= star ? "#facc15" : "#d1d5db",
                          fontSize: "22px",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea
                    placeholder="Write your feedback..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                  <button className="btn-primary" onClick={submitReview}>
                    Submit Review
                  </button>
                </div>
              )}

              <div className="modal-actions">
                <button
                  onClick={() => setSelected(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                {selected.status !== "Completed" && (
                  <button
                    className="btn-success"
                    onClick={() => markAsCompleted(selected.title)}
                  >
                    Mark Completed
                  </button>
                )}
                <button
                  onClick={() => deleteProject(selected.title)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyProjects;
