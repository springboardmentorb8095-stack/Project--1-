import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const STATUS = {
  OPEN: "Open",
  ACQUIRED: "Acquired",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const STORAGE_KEY = "projects";
const USER_KEY = "pm_user";
const nowISO = () => new Date().toISOString();

export default function FreelancerDashboard() {
  // User info
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("freelancer");

  // Projects
  const [projects, setProjects] = useState([]);

  // Load user and projects from localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem(USER_KEY)) || { name: "", role: "freelancer" };
    setUserName(savedUser.name || "");
    setRole(savedUser.role || "freelancer");

    const rawProjects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const migrated = rawProjects.map((p) => ({
      ...p,
      status: p.status || STATUS.OPEN,
      progress: typeof p.progress === "number" ? p.progress : 0,
      freelancerId: p.freelancerId ?? null,
      startDate: p.startDate ?? null,
      endDate: p.endDate ?? null,
      clientId: p.clientId ?? "local-client",
      createdAt: p.createdAt ?? nowISO(),
      updatedAt: p.updatedAt ?? nowISO(),
    }));
    setProjects(migrated);
  }, []);

  // Persist user and projects
  useEffect(() => localStorage.setItem(USER_KEY, JSON.stringify({ name: userName, role })), [userName, role]);
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)), [projects]);

  // --- Freelancer Actions ---
  const acquireProject = (project) => {
    if (!userName) return alert("Enter your name first");
    setProjects((pList) =>
      pList.map((p) =>
        p.id === project.id
          ? { ...p, freelancerId: userName, status: STATUS.ACQUIRED, startDate: p.startDate ?? nowISO(), updatedAt: nowISO() }
          : p
      )
    );
  };

  const updateProgress = (projectId, newProgress) => {
    setProjects((pList) =>
      pList.map((p) => {
        if (p.id !== projectId) return p;
        if (p.freelancerId !== userName) return p;
        const progress = Math.max(0, Math.min(100, Number(newProgress) || 0));
        const completed = progress >= 100;
        return {
          ...p,
          progress,
          status: completed ? STATUS.COMPLETED : progress > 0 ? STATUS.IN_PROGRESS : p.status,
          endDate: completed ? nowISO() : p.endDate,
          updatedAt: nowISO(),
        };
      })
    );
  };

  const fmt = (iso) => (iso ? new Date(iso).toLocaleString() : "-");

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">💼 Freelancer Dashboard</h2>
      <p className="dashboard-subtitle">Manage projects and update progress locally!</p>

      <div className="dashboard-user">
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
        </select>

        <label>Name:</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      <h3>📁 Projects</h3>
      {projects.length === 0 ? (
        <p>No projects yet. Ask a client to post some!</p>
      ) : (
        projects
          .slice()
          .reverse()
          .map((p) => (
            <div key={p.id} className="dashboard-card">
              <div className="pm-card-head">
                <h4>{p.title}</h4>
                <span className={`status-badge ${p.status.replace(/\s+/g, "-").toLowerCase()}`}>{p.status}</span>
              </div>
              <p>{p.description}</p>
              <div className="pm-meta">
                <span>💰 {p.budget}</span>
                <span>⏳ {p.duration}</span>
                <span>🛠 {p.skills}</span>
                <span>Posted by: {p.clientId}</span>
                <span>Started: {fmt(p.startDate)}</span>
                <span>Ended: {fmt(p.endDate)}</span>
              </div>

        <div className="dashboard-card">
          <h3>📁 Projects</h3>
          <p>Explore available projects and apply.</p>
          <button onClick={() => navigate("/projects")}>Find Projects</button>
        </div>
      </div>
    </div>
  );
}
