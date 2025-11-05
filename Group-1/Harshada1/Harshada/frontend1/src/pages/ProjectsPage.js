import React, { useState, useEffect } from "react";
import "./ProjectsPage.css";

function ProjectsSearchPage() {
  const [projects, setProjects] = useState([
    {
      title: "Website Redesign",
      client: "Tech Innovations Ltd",
      budget: 2000,
      deadline: "2025-10-15",
      applied: false,
      status: "Not Applied",
    },
    {
      title: "Mobile App Backend API",
      client: "StartUp Hub",
      budget: 1500,
      deadline: "2025-11-01",
      applied: false,
      status: "Not Applied",
    },
    {
      title: "Portfolio Website",
      client: "John Doe",
      budget: 700,
      deadline: "2025-10-20",
      applied: false,
      status: "Not Applied",
    },
  ]);

  useEffect(() => {
    const storedProjects =
      JSON.parse(localStorage.getItem("freelancerProjects")) || [];
    setProjects((prev) =>
      prev.map((p) => {
        const match = storedProjects.find((s) => s.title === p.title);
        return match ? { ...p, ...match, applied: true } : p;
      })
    );
  }, []);

  // Apply to project
  const handleApply = (project) => {
    const name = prompt("Enter your name to apply:");
    if (!name) return alert("Please enter a name to apply!");

    const newProjects = projects.map((p) =>
      p.title === project.title
        ? { ...p, applied: true, status: "Pending", freelancer: name }
        : p
    );

    setProjects(newProjects);
    localStorage.setItem(
      "freelancerProjects",
      JSON.stringify(newProjects.filter((p) => p.applied))
    );
    alert(`You have successfully applied for "${project.title}" ✅`);
  };

  // Update status
  const handleStatusChange = (title, newStatus) => {
    const updated = projects.map((p) =>
      p.title === title ? { ...p, status: newStatus } : p
    );
    setProjects(updated);
    localStorage.setItem(
      "freelancerProjects",
      JSON.stringify(updated.filter((p) => p.applied))
    );
  };

  return (
    <div className="projects-page fade-in">
      <header className="projects-header">
        <h1>📁 Find Projects</h1>
        <p>Browse and apply for projects that match your skills.</p>
      </header>

      <div className="projects-grid">
        {projects.map((p, i) => (
          <div
            className={`project-card ${p.applied ? "applied" : ""}`}
            key={i}
          >
            <div className="project-card-content">
              <h2 className="project-title">{p.title}</h2>
              <p>
                <strong>Client:</strong> {p.client}
              </p>
              <p>
                <strong>Budget:</strong> ₹{p.budget}
              </p>
              <p>
                <strong>Deadline:</strong> {p.deadline}
              </p>

              {!p.applied ? (
                <button className="btn-apply" onClick={() => handleApply(p)}>
                  Apply Now
                </button>
              ) : (
                <div className="applied-section">
                  <button className="btn-apply applied-btn">✅ Applied</button>

                  <div className="status-update">
                    <label>Status: </label>
                    <select
                      value={p.status}
                      onChange={(e) =>
                        handleStatusChange(p.title, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsSearchPage;
