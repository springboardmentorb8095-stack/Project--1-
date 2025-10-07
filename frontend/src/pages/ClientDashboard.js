import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function ClientDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">👔 Client Dashboard</h2>
      <p className="dashboard-subtitle">
        Manage your posted projects, proposals, and hired freelancers here.
      </p>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>📢 My Projects</h3>
          <p>View and manage all your posted projects.</p>
          <button onClick={() => navigate("/projects")}>Manage Projects</button>
        </div>

        <div className="dashboard-card">
          <h3>📨 Proposals</h3>
          <p>See proposals submitted by freelancers.</p>
          <button onClick={() => navigate("/view-proposals")}>
            View Proposals
          </button>
        </div>

        <div className="dashboard-card">
          <h3>💼 Hires</h3>
          <p>Track freelancers you’ve hired and ongoing work.</p>
          <button onClick={() => navigate("/earnings")}>Track Hires</button>
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;
