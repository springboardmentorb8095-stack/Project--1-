import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ClientDashboard.css";

function PostProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    budget: "",
    skills: "",
    deadline: "",
    status: "Project Posted",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const stored = JSON.parse(localStorage.getItem("clientProjects")) || [];
    stored.push(formData);
    localStorage.setItem("clientProjects", JSON.stringify(stored));
    alert("✅ Project posted successfully!");
    navigate("/my-projects");
  };

  return (
    <div className="container">
      <div className="sidebar">
        <div className="nav-item" onClick={() => navigate("/client-dashboard")}>🏠 Dashboard</div>
        <div className="nav-item" onClick={() => navigate("/my-projects")}>📁 My Projects</div>
        <div className="nav-item" onClick={() => navigate("/post-project")}>➕ Post Project</div>
      </div>

      <div className="main">
        <h2>Create Your Project</h2>
        <form onSubmit={handleSubmit} className="form">
          <input name="title" placeholder="Project Title" onChange={handleChange} required />
          <input name="budget" placeholder="Budget (₹)" type="number" onChange={handleChange} required />
          <input name="skills" placeholder="Required Skills" onChange={handleChange} required />
          <input name="deadline" placeholder="Deadline (YYYY-MM-DD)" type="date" onChange={handleChange} required />
          <button type="submit" className="btn">Post Project</button>
        </form>
      </div>
    </div>
  );
}

export default PostProject;
