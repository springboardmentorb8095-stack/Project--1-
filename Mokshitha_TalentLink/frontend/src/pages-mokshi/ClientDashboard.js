import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ClientDashboard.css";

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("post");
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [skills, setSkills] = useState("");
  const [editingId, setEditingId] = useState(null);
  const profileId = localStorage.getItem("profileId");

  useEffect(() => {
    fetchProjects();
    fetchProposals();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/projects/");
      const clientProjects = res.data.filter(
        (proj) => proj.owner === parseInt(profileId)
      );
      setProjects(clientProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const fetchProposals = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/proposals/");
      setProposals(res.data);
    } catch (err) {
      console.error("Error fetching proposals:", err);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      budget,
      duration,
      owner: parseInt(profileId),
      skills: skills.split(",").map((s) => s.trim()),
    };

    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/api/projects/${editingId}/`, payload);
        alert("✅ Project updated successfully!");
      } else {
        await axios.post("http://127.0.0.1:8000/api/projects/", payload);
        alert("✅ Project created successfully!");
      }

      setTitle("");
      setDescription("");
      setBudget("");
      setDuration("");
      setSkills("");
      setEditingId(null);
      fetchProjects();
      setActiveTab("my-projects");
    } catch (err) {
      console.error("Error saving project:", err);
      alert("❌ Failed to save project!");
    }
  };

  const handleEdit = (proj) => {
    setEditingId(proj.id);
    setTitle(proj.title);
    setDescription(proj.description);
    setBudget(proj.budget);
    setDuration(proj.duration);
    setSkills(proj.skills?.map((s) => s.name).join(", ") || "");
    setActiveTab("post");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project?")) {
      await axios.delete(`http://127.0.0.1:8000/api/projects/${id}/`);
      fetchProjects();
    }
  };

  // ✅ Accept / Reject Proposal
  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/proposals/${id}/`, { status });
      alert(`Proposal ${status}!`);
      fetchProposals();
    } catch (err) {
      console.error("Error updating proposal:", err);
    }
  };

  return (
    <div className="client-dashboard">
      <h1>💼 Client Dashboard</h1>
      <p>Manage your projects and proposals with ease.</p>

      {/* ---------- Tabs ---------- */}
      <div className="tab-buttons">
        <button
          className={activeTab === "post" ? "active" : ""}
          onClick={() => setActiveTab("post")}
        >
          📝 Post Project
        </button>
        <button
          className={activeTab === "my-projects" ? "active" : ""}
          onClick={() => setActiveTab("my-projects")}
        >
          📋 My Projects
        </button>
        <button
          className={activeTab === "proposals" ? "active" : ""}
          onClick={() => setActiveTab("proposals")}
        >
          📩 View Proposals
        </button>
      </div>

      {/* ---------- POST PROJECT ---------- */}
      {activeTab === "post" && (
        <div className="tab-content">
          <h2>{editingId ? "✏️ Edit Project" : "🆕 Post a New Project"}</h2>
          <form onSubmit={handleProjectSubmit} className="project-form">
            <input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Budget (₹)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
            <input
              type="text"
              placeholder="Duration (e.g., 2 weeks)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <input
              type="text"
              placeholder="Skills Required (comma-separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <button type="submit">
              {editingId ? "💾 Update Project" : "🚀 Add Project"}
            </button>
          </form>
        </div>
      )}

      {/* ---------- MY PROJECTS ---------- */}
      {activeTab === "my-projects" && (
        <div className="tab-content">
          <h2>📋 My Projects</h2>
          {projects.length === 0 ? (
            <p>No projects yet. Create one now!</p>
          ) : (
            projects.map((proj) => (
              <div key={proj.id} className="project-card">
                <h3>{proj.title}</h3>
                <p>{proj.description}</p>
                <p>💰 Budget: ₹{proj.budget}</p>
                <p>⏳ Duration: {proj.duration}</p>
                <div className="actions">
                  <button onClick={() => handleEdit(proj)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(proj.id)}>🗑 Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ---------- VIEW PROPOSALS ---------- */}
      {activeTab === "proposals" && (
        <div className="tab-content">
          <h2>📩 Proposals Received</h2>
          {proposals.length === 0 ? (
            <p className="no-proposals">No proposals yet.</p>
          ) : (
            <div className="proposal-grid">
              {proposals.map((p) => (
                <div key={p.id} className="proposal-box">
                  <h3>📁 {p.project_title}</h3>
                  <p><b>Freelancer:</b> {p.freelancer_name}</p>
                  <p><b>Price:</b> ₹{p.price}</p>
                  <p><b>Message:</b> {p.description}</p>
                  <p>
                    <b>Status:</b>{" "}
                    <span className={`status ${p.status}`}>
                      {p.status.toUpperCase()}
                    </span>
                  </p>

                  {p.status === "pending" && (
                    <div className="proposal-buttons">
                      <button onClick={() => handleStatusChange(p.id, "accepted")}>
                        ✅ Accept
                      </button>
                      <button onClick={() => handleStatusChange(p.id, "rejected")}>
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
