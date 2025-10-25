import React, { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.css";
import NavigationBar from "./NavigationBar";
import API from "../api.js";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    duration: "",
  });
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    company_name: "",
    bio: "",
    contact_email: "",
  });

  // Fetch client profile
  const fetchProfile = async () => {
    try {
      const res = await API.get("client-profile/");
      setProfile(res.data);
      setProfileForm({
        company_name: res.data.company_name || "",
        bio: res.data.bio || "",
        contact_email: res.data.contact_email || "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch client's projects
  const fetchProjects = async () => {
    try {
      const res = await API.get("api/projects/"); // fixed URL
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create project
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("api/projects/", form); // fixed URL
      alert("✅ Project created successfully!");
      setForm({
        title: "",
        description: "",
        category: "",
        budget: "",
        duration: "",
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create project.");
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await API.delete(`api/projects/${projectId}/`); // fixed URL
      alert("✅ Project deleted successfully!");
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete project.");
    }
  };

  // Delete proposal
  const deleteProposal = async (proposalId) => {
    if (!window.confirm("Are you sure you want to delete this proposal?")) return;
    try {
      await API.delete(`api/proposals/${proposalId}/`); // fixed URL
      alert("✅ Proposal deleted successfully!");
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete proposal.");
    }
  };

  // Accept proposal
  const acceptProposal = async (proposalId) => {
    if (!window.confirm("Accept this proposal and create contract?")) return;
    try {
      const res = await API.post(`api/proposals/${proposalId}/accept/`);
      if (res.status === 200) {
        alert("✅ Proposal accepted and contract created!");
        fetchProjects();
      } else {
        alert("❌ Failed to accept proposal.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong.");
    }
  };

  // Profile edit handlers
  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async () => {
    try {
      await API.put("client-profile/", profileForm);
      alert("✅ Profile updated!");
      setEditProfile(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update profile.");
    }
  };

  if (!profile) return <p className={styles.loading}>Loading profile...</p>;

  return (
    <div className={styles.dashboardContainer}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <div className={styles.logo}>TalentLink</div>
      </div>

      {/* Main Layout */}
      <div className={styles.mainContent}>
        {/* Navigation Bar - Left */}
        <div className={styles.sidebar}>
          <NavigationBar />
        </div>

        {/* Center Content */}
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>Client Dashboard</h1>

          {/* Add Project Form */}
          <div className={`${styles.card} ${styles.formCard}`}>
            <h2>Add Project</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} required />

              <label>Description</label>
              <input name="description" value={form.description} onChange={handleChange} required />

              <label>Category</label>
              <input name="category" value={form.category} onChange={handleChange} required />

              <label>Budget</label>
              <input type="number" name="budget" value={form.budget} onChange={handleChange} required />

              <label>Duration (days)</label>
              <input type="number" name="duration" value={form.duration} onChange={handleChange} required />

              <button type="submit" className={styles.primaryBtn}>Create Project</button>
            </form>
          </div>

          {/* Projects & Proposals */}
          <div className={`${styles.card} ${styles.projectSection}`}>
            <h2>Your Projects & Proposals</h2>
            {projects.length === 0 ? (
              <p>No projects found.</p>
            ) : (
              projects.map((project) => (
                <div key={project.id} className={styles.projectCard}>
                  <strong>{project.title}</strong> - {project.description}
                  <p>Category: {project.category} | Budget: ${project.budget} | Duration: {project.duration} days</p>
                  <div className={styles.projectButtons}>
                    <button className={styles.deleteProjectBtn} onClick={() => deleteProject(project.id)}>Delete Project</button>
                  </div>

                  <h4>Proposals:</h4>
                  {project.proposals.length === 0 ? (
                    <p>No proposals yet.</p>
                  ) : (
                    <ul className={styles.proposalsList}>
                      {project.proposals.map((p) => (
                        <li key={p.id} className={styles.proposalItem}>
                          {p.freelancer}: {p.proposal_text} | Bid: ${p.bid_amount} | Status: {p.status}
                          <div className={styles.proposalButtons}>
                            {p.status === "Pending" && (
                              <button className={styles.acceptBtn} onClick={() => acceptProposal(p.id)}>Accept</button>
                            )}
                            <button className={styles.deleteBtn} onClick={() => deleteProposal(p.id)}>Delete Proposal</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Profile Card - Right */}
        <div className={styles.profileCard}>
          {editProfile ? (
            <div className={styles.profileForm}>
              <label>Company Name</label>
              <input name="company_name" value={profileForm.company_name} onChange={handleProfileChange} />

              <label>Bio</label>
              <input name="bio" value={profileForm.bio} onChange={handleProfileChange} />

              <label>Email</label>
              <input name="contact_email" value={profileForm.contact_email} onChange={handleProfileChange} />

              <div className={styles.profileButtons}>
                <button className={styles.primaryBtn} onClick={handleProfileSave}>Save</button>
                <button className={styles.deleteBtn} onClick={() => setEditProfile(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className={styles.profileInfo}>
              <h2>Profile</h2>
              <p><strong>Name:</strong> {profile.company_name}</p>
              <p><strong>Bio:</strong> {profile.bio || "No bio provided."}</p>
              <p><strong>Email:</strong> {profile.contact_email}</p>
              <button className={styles.primaryBtn} onClick={() => setEditProfile(true)}>Edit Profile</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
