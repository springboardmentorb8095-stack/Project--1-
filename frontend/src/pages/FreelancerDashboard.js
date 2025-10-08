import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function FreelancerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">💼 Freelancer Dashboard</h2>
      <p className="dashboard-subtitle">
        Welcome! Manage your projects and track your performance here.
      </p>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>📄 My Proposals</h3>
          <p>View and track your submitted proposals.</p>
          <button onClick={() => navigate("/view-proposals")}>
            View Proposals
          </button>
        </div>

        <div className="dashboard-card">
          <h3>💰 Earnings</h3>
          <p>Track your income and completed projects.</p>
          <button onClick={() => navigate("/earnings")}>View Earnings</button>
        </div>

        <div className="dashboard-card">
          <h3>📁 Projects</h3>
          <p>Explore available projects and apply.</p>
          <button onClick={() => navigate("/projects")}>Find Projects</button>
        </div>
        <div className="dashboard-card">
  <h3>🔍 Find Freelancers</h3>
  <p>Search for freelancers by skills, role, or availability.</p>
  <button onClick={() => navigate("/profiles")}>Go to Search</button>
</div>
<div className="dashboard-card">
  <h3>🔍 Find Projects</h3>
  <p>Search for projects by skill, budget, and deadline.</p>
  <button onClick={() => navigate("/projects-search")}>Go</button>
</div>


      </div>
    </div>
  );
}

export default FreelancerDashboard;
