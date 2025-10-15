import React from "react";
import { useNavigate } from "react-router-dom";
import "./FreelancerDashboard.css";

function FreelancerDashboard() {
  const navigate = useNavigate();

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

        {/* ✅ Newly added sidebar item */}
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
    </div>
  );
}

export default FreelancerDashboard;
