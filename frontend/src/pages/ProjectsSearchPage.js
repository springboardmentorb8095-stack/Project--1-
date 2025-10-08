import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css"; // reuse your existing styles

const ProjectsSearchPage = () => {
  const [projects, setProjects] = useState([]);
  const [skill, setSkill] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [deadline, setDeadline] = useState("");

  const fetchProjects = async () => {
    try {
      let url = "http://127.0.0.1:8000/projects/search/?";
      if (skill) url += `search=${skill}&`;
      if (minBudget) url += `budget_min=${minBudget}&`;
      if (maxBudget) url += `budget_max=${maxBudget}&`;
      if (deadline) url += `deadline=${deadline}&`;

      const res = await axios.get(url);
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📁 Find Projects</h2>

      {/* Filters */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Skill"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="number"
          placeholder="Min Budget"
          value={minBudget}
          onChange={(e) => setMinBudget(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="number"
          placeholder="Max Budget"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="date"
          placeholder="Deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button
          onClick={fetchProjects}
          style={{
            padding: "5px 10px",
            cursor: "pointer",
            backgroundColor: "#4b2a99",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Apply Filters
        </button>
      </div>

      {/* Project cards */}
      <div className="dashboard-cards">
        {projects.length === 0 && <p>No projects found.</p>}
        {projects.map((p) => (
          <div className="dashboard-card" key={p.id}>
            <h3>{p.title}</h3>
            <p><strong>Client:</strong> {p.client_name}</p>
            <p><strong>Skills:</strong> {p.skills_required}</p>
            <p><strong>Budget:</strong> ₹{p.budget}</p>
            <p><strong>Deadline:</strong> {p.deadline}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSearchPage;
