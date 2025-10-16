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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    deadline: "",
    reason: "",
  });

  // ✅ Load projects from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("clientProjects")) || [];
    setProjects(stored);
  }, []);

  // ✅ Trigger search only when Enter is pressed
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

  // ✅ Handle input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // ✅ Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const application = {
      projectTitle: selectedProject.title,
      ...formData,
      appliedAt: new Date().toLocaleString(),
    };

    const stored = JSON.parse(localStorage.getItem("applications")) || [];
    stored.push(application);
    localStorage.setItem("applications", JSON.stringify(stored));

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
      {/* ✅ Sidebar */}
      <div className="sidebar">
        <div
          className="nav-item"
          onClick={() => navigate("/freelancer-dashboard")}
        >
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

      {/* ✅ Main Section */}
      <div className="main">
        {/* ✅ Dashboard Content */}
        <div className="metrics">
          <div className="metric-card">
            <div style={{ fontSize: "32px", fontWeight: "bold" }}>₹12,870</div>
            <div>Earnings</div>
          </div>
          <div className="metric-card">
            <div style={{ fontSize: "24px" }}>Rank: 87</div>
            <div>45 Projects</div>
          </div>
        </div>

        {/* ✅ Search Box */}
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

        {/* ✅ Filtered Projects */}
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
                    {/* Left side - project info */}
                    <div>
                      <h3 style={{ marginBottom: "5px" }}>{proj.title}</h3>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Skills:</strong> {proj.skills}
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Budget:</strong> ₹{proj.budget}
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Deadline:</strong> {proj.deadline}
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Status:</strong> {proj.status}
                      </p>
                    </div>

                    {/* Right side - Apply button */}
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

        {/* ✅ Other Dashboard Sections */}
        <div className="section">
          <div className="card">
            <h3>Your Projects</h3>
            <div className="project-item">
              <span>Web app design</span>
              <img src="placeholder.jpg" alt="icon" width="30" />
            </div>
            <div className="project-item">
              <span>Personal website</span>
              <img src="placeholder.jpg" alt="icon" width="30" />
            </div>
          </div>

          <div className="card">
            <h3>Recent Invoices</h3>
            <div className="invoice-item">
              <div>
                <div>Sebastian Bauer</div>
                <div style={{ fontSize: "12px" }}>Completed</div>
              </div>
              <div>₹1,290</div>
            </div>
            <div className="invoice-item">
              <div>
                <div>Christian York</div>
                <div style={{ fontSize: "12px" }}>Pending</div>
              </div>
              <div>₹2,480</div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="card">
            <h3>Recommended Projects</h3>
            <div className="project-item">
              <div>Millions Lager</div>
              <div>₹500</div>
            </div>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button className="btn">Join Now</button>
            </div>
          </div>

          <div className="card" style={{ textAlign: "center" }}>
            <h3>Engage with clients</h3>
            <div># Slack Channel</div>
            <button className="btn">Join</button>
          </div>
        </div>
      </div>

      {/* ✅ Popup Form (Modal) */}
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

