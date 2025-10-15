import React, { useState, useEffect } from "react";
import "./Dashboard.css";

function ProjectsPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    deadline: "",
    reason: "",
  });

  // Fetch projects from backend
  const fetchProjects = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/projects/");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error("Failed to fetch projects");
        // Fallback to sample projects if backend is not available
        setProjects([
          {
            id: 1,
            title: "Website Redesign",
            client: "Tech Innovations Ltd",
            budget: "2000.00",
            deadline: "2025-10-15",
          },
          {
            id: 2,
            title: "Mobile App Backend API",
            client: "StartUp Hub", 
            budget: "1500.00",
            deadline: "2025-11-01",
          },
          {
            id: 3,
            title: "Portfolio Website",
            client: "John Doe",
            budget: "700.00",
            deadline: "2025-10-20",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      // Fallback to sample projects
      setProjects([
        {
          id: 1,
          title: "Website Redesign",
          client: "Tech Innovations Ltd",
          budget: "2000.00",
          deadline: "2025-10-15",
        },
        {
          id: 2,
          title: "Mobile App Backend API",
          client: "StartUp Hub",
          budget: "1500.00", 
          deadline: "2025-11-01",
        },
        {
          id: 3,
          title: "Portfolio Website",
          client: "John Doe",
          budget: "700.00",
          deadline: "2025-10-20",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleApply = (project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    const token = localStorage.getItem("access");
    if (!token) {
      alert("❌ Please log in to submit an application.");
      return;
    }

    // Check if this is a sample project (ID 1, 2, or 3)
    if (selectedProject.id <= 3) {
      // Store application in localStorage for demo purposes
      const newApplication = {
        id: Date.now(), // Use timestamp as unique ID
        project_title: selectedProject.title,
        cover_letter: formData.reason,
        bid_amount: formData.budget.replace('$', ''),
        status: "pending",
        created_at: new Date().toISOString()
      };
      
      // Get existing applications from localStorage
      const existingApplications = JSON.parse(localStorage.getItem('demoApplications') || '[]');
      existingApplications.push(newApplication);
      localStorage.setItem('demoApplications', JSON.stringify(existingApplications));
      
      alert(`
✅ Application Submitted Successfully!
Project: ${selectedProject.title}
Your application has been recorded. You can view it in "My Applications".
      `);
      setShowForm(false);
      setFormData({ name: "", email: "", budget: "", deadline: "", reason: "" });
      return;
    }
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/proposals/submit/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project: selectedProject.id,
          cover_letter: formData.reason,
          bid_amount: parseFloat(formData.budget.replace('$', ''))
        }),
      });

      if (response.ok) {
        alert("✅ Application submitted successfully!");
        setShowForm(false);
        setFormData({ name: "", email: "", budget: "", deadline: "", reason: "" });
      } else {
        const errorData = await response.json();
        console.error("Application failed:", errorData);
        alert("❌ Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("❌ Error submitting application. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading projects...</h2>
        </div>
      </div>
    );
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
