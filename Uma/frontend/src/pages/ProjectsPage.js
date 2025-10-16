import React, { useState } from "react";
import "./Dashboard.css";

function ProjectsPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    deadline: "",
    reason: "",
  });

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

  const handleApply = (project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`
✅ Application Submitted!
Project: ${selectedProject.title}
Name: ${formData.name}
Email: ${formData.email}
Budget: ${formData.budget}
Deadline: ${formData.deadline}
Why Fit: ${formData.reason}
    `);
    setShowForm(false);
    setFormData({ name: "", email: "", budget: "", deadline: "", reason: "" });
  };

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
              onClick={() => handleApply(project)}
            >
              Apply Now
            </button>
          </div>
        ))}
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <label>Email ID</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <label>Project Budget</label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                required
              />

              <label>Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />

              <label>Why are you fit for this project?</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
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

export default ProjectsPage;
