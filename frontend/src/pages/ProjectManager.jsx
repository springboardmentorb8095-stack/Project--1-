import React, { useState, useEffect } from "react";
import "./ProjectManager.css";

const STATUS = {
  OPEN: "Open",
  ACQUIRED: "Acquired",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const STORAGE_KEY = "projects";
const USER_KEY = "pm_user";

const nowISO = () => new Date().toISOString();

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    budget: "",
    duration: "",
    skills: "",
  });

  const [role, setRole] = useState("client"); // 'client' or 'freelancer'
  const [userName, setUserName] = useState("");

  // Load projects and user info on mount
  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const migrated = raw.map((p) => ({
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

    const savedUser = localStorage.getItem(USER_KEY) || "";
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setRole(u.role || "client");
        setUserName(u.name || "");
      } catch {
        setUserName(savedUser);
      }
    }
  }, []);

  // Persist projects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  // Persist user info
  useEffect(() => {
    localStorage.setItem(USER_KEY, JSON.stringify({ role, name: userName }));
  }, [role, userName]);

  // Form change handler
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Create or update project
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userName) return alert("Set your user name at top before creating/updating.");

    if (form.id === null) {
      // create (only clients can create)
      if (role !== "client") return alert("Only clients can create projects. Switch role to Client.");
      const newProject = {
        ...form,
        id: Date.now(),
        clientId: userName,
        status: STATUS.OPEN,
        progress: 0,
        freelancerId: null,
        startDate: null,
        endDate: null,
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };
      setProjects((p) => [...p, newProject]);
    } else {
      // update (only client who owns the project can edit)
      setProjects((pList) =>
        pList.map((p) =>
          p.id === form.id
            ? {
                ...p,
                title: form.title,
                description: form.description,
                budget: form.budget,
                duration: form.duration,
                skills: form.skills,
                updatedAt: nowISO(),
              }
            : p
        )
      );
    }

    setForm({
      id: null,
      title: "",
      description: "",
      budget: "",
      duration: "",
      skills: "",
    });
  };

  // Edit project (prefill form)
  const handleEdit = (project) => {
    if (project.clientId !== userName) {
      return alert("Only the client who posted this project can edit it.");
    }
    setForm({
      id: project.id,
      title: project.title,
      description: project.description,
      budget: project.budget,
      duration: project.duration,
      skills: project.skills,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete project
  const handleDelete = (project) => {
    if (project.clientId !== userName) {
      return alert("Only the client who posted this project can delete it.");
    }
    if (!window.confirm("Delete this project?")) return;
    setProjects((p) => p.filter((x) => x.id !== project.id));
  };

  // Freelancer acquires project
  const acquireProject = (project) => {
    if (role !== "freelancer") return alert("Switch to Freelancer role to acquire.");
    if (!userName) return alert("Set your freelancer name first.");
    setProjects((pList) =>
      pList.map((p) =>
        p.id === project.id
          ? { ...p, freelancerId: userName, status: STATUS.ACQUIRED, startDate: p.startDate ?? nowISO(), updatedAt: nowISO() }
          : p
      )
    );
  };

  // Freelancer updates progress
  const updateProgress = (projectId, newProgress) => {
    setProjects((pList) =>
      pList.map((p) => {
        if (p.id !== projectId) return p;
        if (p.freelancerId !== userName) {
          alert("Only the freelancer assigned to this project can update progress.");
          return p;
        }
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

  // Client assign freelancer manually
  const assignFreelancer = (projectId, freelancerName) => {
    if (role !== "client") return alert("Only clients can assign freelancers.");
    setProjects((pList) =>
      pList.map((p) =>
        p.id === projectId
          ? {
              ...p,
              freelancerId: freelancerName || null,
              status: freelancerName ? STATUS.ACQUIRED : STATUS.OPEN,
              startDate: freelancerName ? p.startDate ?? nowISO() : null,
              updatedAt: nowISO(),
            }
          : p
      )
    );
  };

  const fmt = (iso) => (iso ? new Date(iso).toLocaleString() : "-");

  return (
    <div className="pm-root">
      {/* User info */}
      <div className="pm-topbar">
        <div className="pm-user">
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>

          <label>Name:</label>
          <input
            type="text"
            placeholder="Your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="pm-info">
          <small>Logged as <strong>{userName || "(no name)"}</strong> — role: <em>{role}</em></small>
        </div>
      </div>

      {/* Project Form */}
      <h1 className="pm-title">🧩 Project Posting</h1>
      <form className="pm-form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Project Title" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Project Description" value={form.description} onChange={handleChange} required />
        <input name="budget" placeholder="Budget (e.g. $500)" value={form.budget} onChange={handleChange} required />
        <input name="duration" placeholder="Duration (e.g. 2 weeks)" value={form.duration} onChange={handleChange} required />
        <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} required />
        <div className="pm-form-actions">
          <button type="submit">{form.id ? "Update Project" : "Add Project"}</button>
          <button type="button" onClick={() => setForm({ id: null, title: "", description: "", budget: "", duration: "", skills: "" })} className="btn-secondary">Clear</button>
        </div>
      </form>

      {/* Project List */}
      <div className="pm-list">
        <h2>📋 Project List</h2>
        {projects.length === 0 ? (
          <p className="muted">No projects yet.</p>
        ) : (
          projects.slice().reverse().map((p) => (
            <div key={p.id} className="pm-card">
              <div className="pm-card-head">
                <h3>{p.title}</h3>
                <div className={`status-badge ${p.status.replace(/\s+/g, "-").toLowerCase()}`}>{p.status}</div>
              </div>

              <p className="pm-desc">{p.description}</p>

              <div className="pm-meta">
                <span>💰 {p.budget}</span>
                <span>⏳ {p.duration}</span>
                <span>🛠 {p.skills}</span>
              </div>

              <div className="pm-progress">
                <div className="progress-wrapper">
                  <div className="progress-fill" style={{ width: `${p.progress}%` }} />
                </div>
                <div className="progress-label">{p.progress}%</div>
              </div>

              <div className="pm-small">
                Posted by: <strong>{p.clientId}</strong> • Started: {fmt(p.startDate)} • Ended: {fmt(p.endDate)}
              </div>

              <div className="pm-actions">
                {/* Client controls */}
                {role === "client" && p.clientId === userName && (
                  <>
                    <button onClick={() => handleEdit(p)}>Edit</button>
                    <button onClick={() => handleDelete(p)} className="danger">Delete</button>
                    <div className="assign-inline">
                      <input placeholder="Assign freelancer name" id={`assign-${p.id}`} />
                      <button onClick={() => { const val = document.getElementById(`assign-${p.id}`).value.trim(); if (!val) return alert("Provide a freelancer name."); assignFreelancer(p.id, val); }}>Assign</button>
                    </div>
                  </>
                )}

                {/* Freelancer controls */}
                {role === "freelancer" && (
                  <>
                    {p.status === STATUS.OPEN && <button onClick={() => acquireProject(p)} className="primary">Acquire</button>}
                    {p.freelancerId === userName && (
                      <div className="progress-inline">
                        <input type="range" min="0" max="100" value={p.progress || 0} onChange={(e) => updateProgress(p.id, e.target.value)} />
                        <button onClick={() => updateProgress(p.id, 100)} className="small">Finish</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Clear all projects */}
      <div className="pm-footer">
        <button onClick={() => { if (window.confirm("Clear all local projects?")) { localStorage.removeItem(STORAGE_KEY); setProjects([]); } }} className="danger">Clear All Local Projects</button>
      </div>
    </div>
  );
}
