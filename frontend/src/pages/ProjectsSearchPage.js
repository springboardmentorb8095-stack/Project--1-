import React, { useState } from "react";
import "./Dashboard.css";

const sampleProjects = [
  {
    id: 1,
    title: "Website Redesign",
    client_name: "Tech Innovations Ltd",
    budget: 2000,
    deadline: "2025-10-15",
  },
  {
    id: 2,
    title: "Mobile App Backend API",
    client_name: "StartUp Hub",
    budget: 1500,
    deadline: "2025-11-01",
  },
  {
    id: 3,
    title: "Portfolio Website",
    client_name: "John Doe",
    budget: 700,
    deadline: "2025-10-20",
  },
];

const ProjectsSearchPage = () => {
  const [skill, setSkill] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [showSample, setShowSample] = useState(false);

  const handleApplyFilters = () => {
    if (!skill || !minBudget || !maxBudget || !deadline) {
      alert("Please fill all filter fields before applying.");
      return;
    }
    // Just show sample projects, no backend call
    setShowSample(true);
  };

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
          onClick={handleApplyFilters}
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
        {showSample && (
          <>
            <p style={{ fontWeight: "bold" }}>
              No projects found. Try these projects:
            </p>
            {sampleProjects.map((p) => (
              <div className="dashboard-card" key={p.id}>
                <h3>{p.title}</h3>
                <p>
                  <strong>Client:</strong> {p.client_name}
                </p>
                <p>
                  <strong>Budget:</strong> ${p.budget}
                </p>
                <p>
                  <strong>Deadline:</strong> {p.deadline}
                </p>
                <button
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#4b2a99",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectsSearchPage;
