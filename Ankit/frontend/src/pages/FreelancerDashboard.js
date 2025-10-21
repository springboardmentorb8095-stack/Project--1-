import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FreelancerDashboard.css";

function FreelancerDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAppliedList, setShowAppliedList] = useState(false);
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    deadline: "",
    reason: "",
  });

  // Load client projects and freelancer applications
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("clientProjects")) || [];
    setProjects(stored);

    const applied = JSON.parse(localStorage.getItem("freelancerApplications")) || [];
    setAppliedProjects(applied);
  }, []);

  // Auto-refresh to sync Accept/Reject status from client
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedApps = JSON.parse(localStorage.getItem("freelancerApplications")) || [];
      setAppliedProjects(updatedApps);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchTerm.trim() === "") {
        setFiltered([]);
      } else {
        const result = projects.filter((proj) =>
          proj.skills.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFiltered(result);
      }
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Handle apply form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if already applied
    const freelancerApps = JSON.parse(localStorage.getItem("freelancerApplications")) || [];
    const existingApp = freelancerApps.find(
      (app) => app.projectTitle === selectedProject.title
    );

    if (existingApp) {
      if (existingApp.status === "Accepted") {
        alert("✅ You are already in this project");
        setShowForm(false);
        return;
      } else if (existingApp.status === "Pending") {
        alert("⏳ You have already applied for this project");
        setShowForm(false);
        return;
      }
      // Rejected → allow to apply again
    }

    const application = {
      projectTitle: selectedProject.title,
      ...formData,
      status: "Pending",
      appliedAt: new Date().toLocaleString(),
    };

    // Save to client applications
    const storedApps = JSON.parse(localStorage.getItem("applications")) || [];
    storedApps.push(application);
    localStorage.setItem("applications", JSON.stringify(storedApps));

    // Save to freelancer applications
    freelancerApps.push(application);
    localStorage.setItem("freelancerApplications", JSON.stringify(freelancerApps));

    setAppliedProjects(freelancerApps);
    alert(`✅ Application submitted for ${selectedProject.title}!`);

    setFormData({
      name: "",
      email: "",
      budget: "",
      deadline: "",
      reason: "",
    });
    setShowForm(false);
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="nav-item" onClick={() => navigate("/freelancer-dashboard")}>
          📊 Dashboard
        </div>
        <div className="nav-item" onClick={() => navigate("/projects")}>
          📁 Projects
        </div>
        <div className="nav-item" onClick={() => navigate("/projects-search")}>
          🔍 Find Projects
        </div>
        <div className="nav-item">💰 Invoices</div>
        <div className="nav-item">📈 Reports</div>
      </div>

      {/* Main Section */}
      <div className="main">
        {/* Top Stats */}
        <div className="metrics">
          <div className="metric-card">
            <div style={{ fontSize: "32px", fontWeight: "bold" }}>₹12,8700</div>
            <div>Earnings</div>
          </div>

          <div
            className="metric-card"
            style={{ cursor: "pointer" }}
            onClick={() => setShowAppliedList(!showAppliedList)}
          >
            <div style={{ fontSize: "24px" }}>
              📨 Total Applied: {appliedProjects.length}
            </div>
            <div>Click to view</div>
          </div>

          <div className="metric-card">
            <div style={{ fontSize: "24px" }}>Rank: 87</div>
            <div>45 Projects</div>
          </div>
        </div>

        {/* Applied Project List */}
        {showAppliedList && (
          <div
            style={{
              background: "#f8f9fa",
              borderRadius: "10px",
              padding: "20px",
              marginTop: "15px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>📋 Your Applied Projects</h3>
            {appliedProjects.length > 0 ? (
              appliedProjects.map((app, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "10px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <strong>{app.projectTitle}</strong>
                  <p style={{ margin: "5px 0" }}>
                    Status:{" "}
                    <span
                      style={{
                        color:
                          app.status === "Accepted"
                            ? "green"
                            : app.status === "Rejected"
                            ? "red"
                            : "orange",
                        fontWeight: "bold",
                      }}
                    >
                      {app.status}
                    </span>
                  </p>
                  <p style={{ margin: "5px 0", fontSize: "13px" }}>
                    Applied on: {app.appliedAt}
                  </p>
                </div>
              ))
            ) : (
              <p>No applications yet 🚫</p>
            )}
          </div>
        )}

        {/* Search Box */}
        <div style={{ margin: "20px 0" }}>
          <input
            type="text"
            placeholder="Search projects by skill and press Enter..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            style={{
              width: "60%",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Filtered Projects */}
        {searchTerm && (
          <>
            {filtered.length > 0 ? (
              <div>
                {filtered.map((proj, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#f3f4f6",
                      padding: "15px",
                      borderRadius: "10px",
                      marginBottom: "15px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div>
                      <h3 style={{ marginBottom: "5px" }}>{proj.title}</h3>
                      <p>
                        <strong>Skills:</strong> {proj.skills}
                      </p>
                      <p>
                        <strong>Budget:</strong> ₹{proj.budget}
                      </p>
                      <p>
                        <strong>Deadline:</strong> {proj.deadline}
                      </p>
                    </div>

                    <button
                      className="apply-btn"
                      onClick={() => {
                        setSelectedProject(proj);
                        setShowForm(true);
                      }}
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No matching projects found ❌</p>
            )}
          </>
        )}
      </div>

      {/* Apply Form (Popup Modal) */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Apply for {selectedProject?.title}</h3>
            <form onSubmit={handleSubmit} className="apply-form">
              <label>Enter Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <label>Email ID</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />

              <label>Project Budget</label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                required
              />

              <label>Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                required
              />

              <label>Why are you fit for this project?</label>
              <textarea
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                placeholder="Explain why you're the right fit for this project..."
                rows="4"
                required
              ></textarea>

              <div className="modal-buttons">
                <button type="submit" className="dashboard-btn">
                  ✅ Submit
                </button>
                <button
                  type="button"
                  className="dashboard-btn cancel"
                  onClick={() => setShowForm(false)}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FreelancerDashboard;
