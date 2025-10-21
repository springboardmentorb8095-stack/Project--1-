import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ClientDashboard.css";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("clientProjects")) || [];
    setProjects(stored);
  }, []);

  return (
    <div className="container">
      <div className="sidebar">
        <div className="nav-item" onClick={() => navigate("/client-dashboard")}>🏠 Dashboard</div>
        <div className="nav-item" onClick={() => navigate("/my-projects")}>📁 My Projects</div>
        <div className="nav-item" onClick={() => navigate("/post-project")}>➕ Post Project</div>
      </div>

      <div className="main">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>My Projects</h2>
          <button
            className="btn"
            onClick={() => navigate("/post-project")}
          >
            ➕ Create Your Project
          </button>
        </div>

        {projects.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "30px" }}>
            You didn’t post any project yet 😅
          </p>
        ) : (
          <div style={{ marginTop: "20px" }}>
            {projects.map((p, i) => (
              <div
                key={i}
                style={{
                  background: "#f3f4f6",
                  padding: "15px",
                  borderRadius: "10px",
                  marginBottom: "15px",
                }}
              >
                <h3>{p.title}</h3>
                <p><strong>Budget:</strong> ₹{p.budget}</p>
                <p><strong>Skills:</strong> {p.skills}</p>
                <p><strong>Deadline:</strong> {p.deadline}</p>
                <p><strong>Status:</strong> {p.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProjects;
