import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paper,
  Button,
  TextField,
  Avatar,
  IconButton,
  Divider,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  Notifications,
  Settings,
  Edit,
  CheckCircle,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NotificationToast from "../components/NotificationToast";
import axios from "axios";
import "./FreelancerDashboard.css";

const API_ROOT = process.env.REACT_APP_API_ROOT || "http://127.0.0.1:8000";

function FreelancerDashboard() {
  // ===================== STATES =====================
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Notification states
  const [anchorNotif, setAnchorNotif] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Derived unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    contact: "",
    skills: "",
    hourly_rate: "",
    experience: "",
  });

  // NEW — Reviews & Ratings
  const [reviews, setReviews] = useState([
    {
      id: 1,
      client: "Client A",
      rating: 5,
      comment: "Excellent work and clear communication!",
      date: "2025-10-30, 5:42 PM",
    },
    {
      id: 2,
      client: "Client B",
      rating: 4,
      comment: "Good job overall, delivered on time!",
      date: "2025-11-01, 3:15 PM",
    },
  ]);
  const [averageRating, setAverageRating] = useState(0);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Freelancer",
    email: "freelancer@example.com",
  };

  // ===================== LIFECYCLE =====================
  useEffect(() => {
    const storedProjects =
      JSON.parse(localStorage.getItem("freelancerProjects")) || [
        { title: "Website Redesign", status: "Completed" },
        { title: "Portfolio Landing Page", status: "Active" },
      ];
    setProjects(storedProjects);

    const sampleNotifications = [
      { id: 1, text: "Client approved your proposal 💼", read: false },
      { id: 2, text: "New project available: E-commerce UI 🔥", read: false },
      { id: 3, text: "Payment received ₹2,000 💰", read: true },
    ];
    setNotifications(sampleNotifications);

    setProfile({
      name: user.username || "",
      email: user.email || "",
      contact: "",
      skills: "React, Django",
      hourly_rate: "500",
      experience: "2 years",
    });
  }, []);

  // Fetch real reviews
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await axios.get(`${API_ROOT}/api/reviews/`);
        if (res.data && res.data.length > 0) {
          setReviews(res.data);
        }
      } catch (error) {
        console.warn("⚠️ Could not fetch reviews, using defaults.");
      }
    }
    fetchReviews();
  }, []);

  // Compute average rating
  useEffect(() => {
    if (reviews.length > 0) {
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      setAverageRating(avg.toFixed(1));
    } else {
      setAverageRating(0);
    }
  }, [reviews]);

  // ===================== HANDLERS =====================
  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("freelancerProfile", JSON.stringify(profile));
      setLoading(false);
      setModalOpen(false);
      setToast("✅ Profile updated successfully!");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 800);
  };

  const handleNotifClick = (e) => setAnchorNotif(e.currentTarget);
  const handleNotifClose = () => setAnchorNotif(null);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const invoices = [
    { id: 1, name: "Logo Design", amount: 500 },
    { id: 2, name: "Web App Project", amount: 2000 },
  ];

  // ===================== RENDER =====================
  return (
    <div className={`dashboard-page ${darkMode ? "dark-mode" : ""}`}>
      {/* ===== SIDEBAR ===== */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <Avatar
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Freelancer Avatar"
            sx={{ width: 70, height: 70 }}
          />
          <div>
            <h2>{user.username}</h2>
            <p>Freelancer</p>
            <p className="rating-line">
              ⭐ {averageRating}/5.0 ({reviews.length} reviews)
            </p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => navigate("/dashboard")}>📊 Dashboard</button>
          <button onClick={() => navigate("/projects")}>📁 Projects</button>
          <button onClick={() => navigate("/findwork")}>🔍 Find Work</button>
          <button onClick={() => navigate("/contracts")}>📜 Contracts</button>
          <button onClick={() => navigate("/chat")}>💬 Messages</button>
        </nav>

        <div className="theme-toggle">
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </div>
      </aside>

      {/* ===== MAIN DASHBOARD ===== */}
      <main className="dashboard-main">
        {/* ===== TOPBAR ===== */}
        <header className="dashboard-topbar">
          <div>
            <h1>👋 Hello, {user.username}</h1>
            <p className="subtitle">
              Welcome to your professional dashboard 🌈
            </p>
          </div>

          <div className="topbar-actions">
            <Tooltip title="Notifications">
              <IconButton onClick={handleNotifClick}>
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  invisible={unreadCount === 0}
                >
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit Profile">
              <IconButton onClick={() => setModalOpen(true)} color="primary">
                <Edit />
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings">
              <IconButton color="default">
                <Settings />
              </IconButton>
            </Tooltip>
          </div>
        </header>

        {/* ===== NOTIFICATION MENU ===== */}
        <Menu
          anchorEl={anchorNotif}
          open={Boolean(anchorNotif)}
          onClose={handleNotifClose}
          PaperProps={{
            style: {
              width: 320,
              borderRadius: 12,
              padding: "0.5rem",
              backgroundColor: darkMode ? "#1f1f1f" : "#fff",
              color: darkMode ? "#fff" : "#000",
            },
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.3rem 0.5rem",
            }}
          >
            <h4>Notifications</h4>
            <Button onClick={handleMarkAllRead} size="small">
              Mark all as read
            </Button>
          </div>
          <Divider />
          {notifications.length === 0 ? (
            <MenuItem disabled>No notifications yet 🎉</MenuItem>
          ) : (
            notifications.map((n) => (
              <MenuItem
                key={n.id}
                onClick={() => {
                  setNotifications((prev) =>
                    prev.map((item) =>
                      item.id === n.id ? { ...item, read: true } : item
                    )
                  );
                }}
                style={{
                  fontWeight: n.read ? "normal" : "bold",
                  backgroundColor: n.read
                    ? "transparent"
                    : darkMode
                    ? "#2b2b2b"
                    : "#f5f5f5",
                }}
              >
                {n.text}
              </MenuItem>
            ))
          )}
        </Menu>

        {/* ===== METRICS ===== */}
        <section className="dashboard-metrics">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="metric-card gradient-blue"
          >
            <h3>💰 Earnings</h3>
            <p>₹12,870</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="metric-card gradient-green"
          >
            <h3>📂 Active Projects</h3>
            <p>{projects.filter((p) => p.status === "Active").length}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="metric-card gradient-pink"
          >
            <h3>✅ Completed</h3>
            <p>{projects.filter((p) => p.status === "Completed").length}</p>
          </motion.div>
        </section>

        {/* ===== PROFILE & MESSAGES ===== */}
        <section className="dashboard-grid">
          <Paper className="dashboard-card">
            <h3>💼 Profile Overview</h3>
            <Divider />
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Skills:</strong> {profile.skills}
            </p>
            <p>
              <strong>Hourly Rate:</strong> ₹{profile.hourly_rate}/hr
            </p>
            <p>
              <strong>Experience:</strong> {profile.experience}
            </p>
          </Paper>

          <Paper className="dashboard-card">
            <h3>💬 Messages</h3>
            <Divider />
            <ul className="messages-list">
              <li>
                <strong>Client A:</strong> “Can we discuss the project timeline?”
              </li>
              <li>
                <strong>Client B:</strong> “Please share your portfolio.”
              </li>
            </ul>
            <Button variant="contained" onClick={() => navigate("/chat")}>
              💬 Open Chat
            </Button>
          </Paper>
        </section>

        {/* ===== PROJECTS, INVOICES, REVIEWS ===== */}
        <section className="dashboard-grid">
          <Paper className="dashboard-card">
            <h3>🧠 Your Projects</h3>
            {projects.map((p, i) => (
              <div key={i} className="invoice-item">
                <span>{p.title}</span>
                <strong>{p.status}</strong>
              </div>
            ))}
          </Paper>

          <Paper className="dashboard-card">
            <h3>💸 Invoices</h3>
            {invoices.map((i) => (
              <div key={i.id} className="invoice-item">
                <span>{i.name}</span>
                <strong>₹{i.amount}</strong>
              </div>
            ))}
          </Paper>
        </section>

        {/* ===== REVIEWS & RATINGS ===== */}
        <section className="dashboard-grid">
          <Paper className="dashboard-card">
            <h3>⭐ Client Reviews & Ratings</h3>
            <Divider sx={{ mb: 1 }} />
            {reviews.length === 0 ? (
              <p>No reviews yet. Once clients rate you, they’ll appear here.</p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="review-item">
                  <div className="review-header">
                    <strong>{r.client}</strong>
                    <span className="stars">
                      {"⭐".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </span>
                  </div>
                  <p className="review-comment">💬 {r.comment}</p>
                  <small className="review-date">{r.date}</small>
                </div>
              ))
            )}
          </Paper>
        </section>

        {/* ===== EDIT PROFILE MODAL ===== */}
        <AnimatePresence>
          {modalOpen && (
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
              >
                <h2 className="modal-title">💼 Edit Profile</h2>
                <div className="modal-form">
                  <TextField
                    label="Name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Contact"
                    name="contact"
                    value={profile.contact}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Skills"
                    name="skills"
                    value={profile.skills}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Hourly Rate"
                    name="hourly_rate"
                    value={profile.hourly_rate}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Experience"
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                    fullWidth
                  />
                </div>
                <div className="modal-buttons">
                  <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? "⏳ Saving..." : "💾 Save"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== SUCCESS ICON ===== */}
        <AnimatePresence>
          {success && (
            <motion.div
              className="success-toast"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CheckCircle fontSize="large" />
            </motion.div>
          )}
        </AnimatePresence>

        {toast && (
          <NotificationToast message={toast} onClose={() => setToast("")} />
        )}
      </main>
    </div>
  );
}

export default FreelancerDashboard;
