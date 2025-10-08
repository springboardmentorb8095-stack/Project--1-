import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ClientDashboard() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem("clientProjects")) || [];
    setProjects(savedProjects);
  }, []);

  // Example summary stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "Active").length;
  const completedProjects = projects.filter((p) => p.status === "Completed").length;

  return (
    <div style={{ padding: "20px" }}>
      {/* ✅ Header with "Create Project" Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>📊 Client Dashboard</h2>
        <button
          onClick={() => navigate("/post-project")}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ➕ Create Project
        </button>
      </div>

      {/* ✅ Summary Cards */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "#f1f5ff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            flex: "1",
            textAlign: "center",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <h3>Total Projects</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{totalProjects}</p>
        </div>

        <div
          style={{
            background: "#e7f9ee",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            flex: "1",
            textAlign: "center",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <h3>Active Projects</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{activeProjects}</p>
        </div>

        <div
          style={{
            background: "#fff4e6",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            flex: "1",
            textAlign: "center",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <h3>Completed Projects</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{completedProjects}</p>
        </div>
      </div>

      {/* ✅ Project List */}
      <h3 style={{ marginBottom: "10px" }}>🗂️ My Projects</h3>
      {projects.length === 0 ? (
        <p>You didn't post any project yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {projects.map((project, index) => (
            <div
              key={index}
              style={{
                background: "#f8f9fa",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #dee2e6",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h4>{project.title}</h4>
              <p>💰 Budget: {project.budget}</p>
              <p>🧠 Skills: {project.skills}</p>
              <p>📅 Deadline: {project.deadline}</p>
              <p>📌 Status: <b>{project.status}</b></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientDashboard;
