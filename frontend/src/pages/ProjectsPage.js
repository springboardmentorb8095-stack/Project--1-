import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function ProjectsPage() {
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      title: "Website Redesign",
      client: "Tech Innovations Ltd",
      budget: "$2000",
      deadline: "2025-10-15",
    },
    {
      id: 2,
      title: "Mobile App Backend API",
      client: "StartUp Hub",
      budget: "$1500",
      deadline: "2025-11-01",
    },
    {
      id: 3,
      title: "Portfolio Website",
      client: "John Doe",
      budget: "$700",
      deadline: "2025-10-20",
    },
  ];

  function handleApply(projectId) {
    // navigate to apply form route for this project
    navigate(`/projects/${projectId}/apply`);
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📁 Projects</h2>
      <p className="dashboard-subtitle">
        Explore available projects and apply for the ones that suit you best.
      </p>

      <div className="dashboard-cards">
        {projects.map((project) => (
          <div className="dashboard-card" key={project.id}>
            <h3>{project.title}</h3>
            <p><strong>Client:</strong> {project.client}</p>
            <p><strong>Budget:</strong> {project.budget}</p>
            <p><strong>Deadline:</strong> {project.deadline}</p>
            <button
              className="dashboard-btn"
              onClick={() => handleApply(project.id)}
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;
