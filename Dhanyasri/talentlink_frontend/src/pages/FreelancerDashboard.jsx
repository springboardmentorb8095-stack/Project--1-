import React, { useEffect, useState } from "react";
import styles from "../styles/FreelancerDashboard.module.css";
import NavigationBar from "./NavigationBar";
import API from "../api.js";

function FreelancerDashboard() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [proposalForms, setProposalForms] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch freelancer profile
  const fetchProfile = async () => {
    try {
      const res = await API.get("freelancer-profile/");
      setProfile(res.data);
    } catch (err) {
      console.error("Profile fetch error:", err);
      alert("⚠ Please login to access your profile.");
    }
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await API.get("projects/");
      setProjects(res.data);
    } catch (err) {
      console.error("Projects fetch error:", err);
      alert("⚠ Unable to fetch projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchProjects();
  }, []);

  // Handle input changes for proposals
  const handleChange = (projectId, e) => {
    setProposalForms({
      ...proposalForms,
      [projectId]: {
        ...proposalForms[projectId],
        [e.target.name]: e.target.value,
      },
    });
  };

  // Submit proposal
  const submitProposal = async (projectId) => {
    const form = proposalForms[projectId] || {};
    if (!form.proposal_text || !form.bid_amount) {
      alert("Please fill in both proposal text and bid amount.");
      return;
    }

    try {
      await API.post("proposals/", {
        project: projectId,
        proposal_text: form.proposal_text,
        bid_amount: form.bid_amount,
      });
      alert("✅ Proposal submitted successfully!");
      setProposalForms({
        ...proposalForms,
        [projectId]: { proposal_text: "", bid_amount: "" },
      });
      fetchProjects(); // Refresh projects
    } catch (err) {
      console.error("Proposal submission error:", err.response?.data || err);
      alert("❌ Failed to submit proposal. Check console for details.");
    }
  };

  if (loading) return <p className={styles.loading}>Loading dashboard...</p>;
  if (!profile) return <p className={styles.loading}>Loading profile...</p>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>TalentLink</div>
      </div>

      <div className={styles.mainContent}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <NavigationBar />
        </div>

        {/* Center Content */}
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>Freelancer Dashboard</h1>

          <div className={`${styles.card} ${styles.projectSection}`}>
            <h2>Available Projects</h2>
            {projects.length === 0 ? (
              <p>No projects found.</p>
            ) : (
              projects.map((project) => (
                <div key={project.id} className={styles.projectCard}>
                  <strong>{project.title}</strong> - {project.description}
                  <p>
                    Category: {project.category} | Budget: ${project.budget} |
                    Duration: {project.duration} days
                  </p>

                  {/* ✅ Show project status */}
                  {project.status && (
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          project.status === "Completed"
                            ? styles.completed
                            : project.status === "Accepted"
                            ? styles.accepted
                            : styles.pending
                        }
                      >
                        {project.status}
                      </span>
                    </p>
                  )}

                  {/* ✅ Show Review if available */}
                  {project.status === "Completed" && project.review && (
                    <div className={styles.reviewSection}>
                      <h4>Client Review</h4>
                      <p>
                        <strong>Rating:</strong>{" "}
                        {"⭐".repeat(project.review.rating)}
                      </p>
                      <p>
                        <strong>Feedback:</strong> {project.review.feedback}
                      </p>
                    </div>
                  )}

                  {/* Proposal Form */}
                  <div className={styles.card}>
                    <h4>Submit Proposal</h4>
                    <label>Cover Letter</label>
                    <input
                      className={styles.form}
                      name="proposal_text"
                      placeholder="Cover Letter"
                      value={proposalForms[project.id]?.proposal_text || ""}
                      onChange={(e) => handleChange(project.id, e)}
                      autoComplete="off"
                    />
                    <label>Bid Amount</label>
                    <input
                      className={styles.form}
                      name="bid_amount"
                      type="number"
                      placeholder="Bid Amount"
                      value={proposalForms[project.id]?.bid_amount || ""}
                      onChange={(e) => handleChange(project.id, e)}
                      autoComplete="off"
                    />
                    <button
                      className={styles.primaryBtn}
                      onClick={() => submitProposal(project.id)}
                    >
                      Submit Proposal
                    </button>
                  </div>

                  {/* Freelancer's Proposals */}
                  {project.proposals && project.proposals.length > 0 && (
                    <>
                      <h4>Proposals Submitted:</h4>
                      <ul className={styles.proposalsList}>
                        {project.proposals
                          .filter(
                            (p) => p.freelancer.username === profile.user.username
                          )
                          .map((p) => (
                            <li key={p.id} className={styles.proposalItem}>
                              {p.proposal_text} | Bid: ${p.bid_amount} | Status:{" "}
                              {p.status}
                            </li>
                          ))}
                      </ul>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className={styles.profileCard}>
          <h2>Your Profile</h2>
          <p>
            <strong>Portfolio:</strong> {profile.portfolio || "No portfolio yet."}
          </p>
          <p>
            <strong>Skills:</strong> {profile.skills || "No skills added."}
          </p>
          <p>
            <strong>Hourly Rate:</strong>{" "}
            {profile.hourly_rate ? `$${profile.hourly_rate}/hr` : "Not set"}
          </p>
          <p>
            <strong>Availability:</strong>{" "}
            {profile.availability ? "Available" : "Not Available"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FreelancerDashboard;
