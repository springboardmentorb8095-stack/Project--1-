import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./ClientDashboard.css";
import NotificationBox from "./NotificationBox";

export default function ClientDashboard() {
  const [showWelcome, setShowWelcome] = useState(true);

  const [profile, setProfile] = useState({});
  const [editingProfile, setEditingProfile] = useState(false);

  const [activeTab, setActiveTab] = useState("profile");
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [skills, setSkills] = useState("");
  const [editingId, setEditingId] = useState(null);
  
  const [showReviewBox, setShowReviewBox] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const navigate = useNavigate();
  const profileId = localStorage.getItem("profileId");
  const username =
    localStorage.getItem("profileName") ||
    localStorage.getItem("username") ||
    "";

  /* ---------------------------------------
     ✅ Auto-switch to Reviews If "#reviews"
  ----------------------------------------*/
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#reviews") {
        setActiveTab("reviews");
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  /* ---------------------------------------
     ✅ Auto-remove welcome screen
  ----------------------------------------*/
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
      setActiveTab("profile");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  /* ---------------------------------------
     ✅ Fetch Profile
  ----------------------------------------*/
  const fetchProfile = useCallback(async () => {
    if (!profileId) return;
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/profiles/${profileId}/`);
      setProfile(res.data);
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  }, [profileId]);

  /* ---------------------------------------
     ✅ Fetch Projects
  ----------------------------------------*/
  const fetchProjects = useCallback(async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/projects/");
      const myProjects = res.data.filter((p) => p.owner === parseInt(profileId));
      setProjects(myProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  }, [profileId]);

  /* ---------------------------------------
     ✅ Fetch Proposals
  ----------------------------------------*/
  const fetchProposals = useCallback(async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/proposals/");
      setProposals(res.data);
    } catch (err) {
      console.error("Error fetching proposals:", err);
    }
  }, []);

  /* ---------------------------------------
     ✅ Fetch Contracts
  ----------------------------------------*/
  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/contracts/");
      const storedName =
        (localStorage.getItem("profileName") ||
          localStorage.getItem("username") ||
          "").trim().toLowerCase();

      const filtered = res.data.filter((c) => {
        const clientName = (c.client_name || "").trim().toLowerCase();
        return clientName === storedName;
      });

      setContracts(filtered);
    } catch (err) {
      console.error("Error fetching contracts:", err);
    }
    setLoading(false);
  }, []);

  /* ---------------------------------------
     ✅ FIRST LOAD
  ----------------------------------------*/
  useEffect(() => {
    fetchProfile();
    fetchProjects();
    fetchProposals();
    fetchContracts();
  }, [fetchProfile, fetchProjects, fetchProposals, fetchContracts]);

  /* ---------------------------------------
     ✅ Logout
  ----------------------------------------*/
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* ---------------------------------------
     ✅ Update Profile
  ----------------------------------------*/
  const handleProfileUpdate = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/profiles/${profileId}/`,
        profile
      );
      setEditingProfile(false);
      fetchProfile();
      alert("✅ Profile updated!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Failed to update profile");
    }
  };

  /* ---------------------------------------
     ✅ CREATE / UPDATE PROJECT
  ----------------------------------------*/
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
        alert("✅ Project updated!");
      } else {
        await axios.post("http://127.0.0.1:8000/api/projects/", payload);
        alert("✅ Project created!");
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
      alert("❌ Failed!");
    }
  };
  /* ---------------------------------------
   ✅ Edit Project (Load into form)
----------------------------------------*/
const handleEdit = (proj) => {
  setEditingId(proj.id);
  setTitle(proj.title);
  setDescription(proj.description);
  setBudget(proj.budget);
  setDuration(proj.duration);
  setSkills(proj.skills_required?.map((s) => s.name).join(", ") || "");
  setActiveTab("post");
};


  /* ---------------------------------------
     ✅ Delete Project
  ----------------------------------------*/
  const handleDelete = async (id) => {
    if (window.confirm("Delete this project?")) {
      await axios.delete(`http://127.0.0.1:8000/api/projects/${id}/`);
      fetchProjects();
    }
  };

  /* ---------------------------------------
     ✅ Accept / Reject Proposal
  ----------------------------------------*/
  const handleStatusChange = async (proposal, status) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/proposals/${proposal.id}/`, {
        status,
      });
      alert(`Proposal ${status}!`);

      if (status === "accepted") {
        await axios.post("http://127.0.0.1:8000/api/contracts/", {
          proposal: proposal.id,
          project_title: proposal.project_title,
          freelancer_name: proposal.freelancer_name,
          client_name: username,
          start_date: new Date().toISOString().split("T")[0],
          end_date: "2025-12-31",
          status: "active",
          terms: "Standard terms apply.",
        });
        alert("📜 Contract created!");
        fetchContracts();
      }

      fetchProposals();
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------------------------------
     ✅ Mark Contract Completed
  ----------------------------------------*/
  const markAsCompleted = async (id) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/contracts/${id}/`, {
        status: "completed",
      });
      alert("✅ Marked completed");
      fetchContracts();
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------------------------------
     ✅ Submit Review
  ----------------------------------------*/
  const handleSubmitReview = async (contract) => {
    const reviewerId = profileId;

    let revieweeId = null;
    try {
      const profilesRes = await axios.get("http://127.0.0.1:8000/api/profiles/");
      const freelancerProfile = profilesRes.data.find(
        (p) => p.user_name === contract.freelancer_name
      );
      if (freelancerProfile) revieweeId = freelancerProfile.id;
    } catch (err) {
      console.error(err);
    }

    if (!revieweeId) {
      alert("❌ Freelancer not found");
      return;
    }

    const payload = {
      reviewer: reviewerId,
      reviewee: revieweeId,
      project: contract.project || contract.id,
      rating: contract.newRating || 5,
      comment: contract.newComment || "Great work!",
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/reviews/", payload);
      alert("✅ Review submitted");
      setReviewComment("");
      setShowReviewBox(null);
    } catch (err) {
      alert("❌ Failed to submit");
      console.error(err);
    }
  };

  /* ---------------------------------------
     ✅ Back Button
  ----------------------------------------*/
  const handleBack = () => {
    if (activeTab !== "profile") {
      setActiveTab("profile");
    } else {
      navigate("/");
    }
  };

  const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
};

  /* -------------------------------------------------
     ✅  UI
  ---------------------------------------------------*/
  return (
  <div className="client-layout">

    {/* ✅ Welcome Splash */}
    {showWelcome && (
      <div className="welcome">
        <div className="welcome-card">
          <div className="welcome-title">Welcome to Client Dashboard!</div>
          <div className="welcome-sub">Loading your workspace…</div>
        </div>
      </div>
    )}

    {!showWelcome && (
      <>
        {/* ✅ NAVBAR */}
        <div className="client-nav">
          <div className="logo">TalentLink</div>
          

          <nav>
            <button onClick={() => scrollToSection("profile")}>🧑 Profile</button>
            <button onClick={() => scrollToSection("post")}>📝 Post Project</button>
            <button onClick={() => scrollToSection("my-projects")}>📋 My Projects</button>
            <button onClick={() => scrollToSection("proposals")}>📩 Proposals</button>
            <button onClick={() => scrollToSection("contracts")}>📜 Contracts</button>
          </nav>

          <div className="nav-right">
            <NotificationBox />
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
<div className="client-header">
  <h2>Client Workspace</h2>
  <p>Manage your profile, post projects, review proposals, chat, and track contracts.</p>
</div>

        <main className="client-main">
          <div className="container">

            {/* ✅ PROFILE */}
            <section id="profile" className="tl-section">
              <h2 className="tl-section-title">My Profile</h2>

              {!editingProfile ? (
                <div className="tl-card">
                  <div className="profile-header">
                    <div className="profile-avatar">
                      {profile.user_name?.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <h2>{profile.user_name}</h2>
                      <p className="email">{profile.email}</p>
                    </div>
                  </div>

                  <div className="section">
                    <h3>👤 About</h3>
                    <p>{profile.bio || "Not provided"}</p>
                  </div>

                  {profile.portfolio && (
                    <div className="section">
                      <h3>🌐 Portfolio</h3>
                      <a href={profile.portfolio} target="_blank" rel="noopener noreferrer">
                        {profile.portfolio}
                      </a>
                    </div>
                  )}

                  <button className="btn-edit" onClick={() => setEditingProfile(true)}>✏️ Edit Profile</button>
                </div>
              ) : (
                <div className="tl-card profile-edit-card">
                  <input value={profile.user_name} onChange={(e)=>setProfile({...profile,user_name:e.target.value})} placeholder="Name"/>
                  <input value={profile.email} onChange={(e)=>setProfile({...profile,email:e.target.value})} placeholder="Email"/>
                  <textarea value={profile.bio} onChange={(e)=>setProfile({...profile,bio:e.target.value})} placeholder="Bio"/>
                  <input value={profile.portfolio} onChange={(e)=>setProfile({...profile,portfolio:e.target.value})} placeholder="Portfolio link"/>

                  <div className="profile-edit-actions">
                    <button onClick={handleProfileUpdate} className="btn-save">💾 Save</button>
                    <button className="btn-cancel" onClick={()=>setEditingProfile(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </section>



            {/* ✅ POST PROJECT */}
            <section id="post" className="tl-section">
              <h2 className="tl-section-title">Post a New Project</h2>

              <div className="tl-card">
                <form onSubmit={handleProjectSubmit}>
                  <input className="tl-field" placeholder="Project Title" value={title} onChange={(e)=>setTitle(e.target.value)} required />
                  <textarea className="tl-field" placeholder="Project Description" value={description} onChange={(e)=>setDescription(e.target.value)} required />
                  <input className="tl-field" placeholder="Budget (₹)" value={budget} onChange={(e)=>setBudget(e.target.value)} />
                  <input className="tl-field" placeholder="Duration" value={duration} onChange={(e)=>setDuration(e.target.value)} />
                  <input className="tl-field" placeholder="Skills Required (comma-separated)" value={skills} onChange={(e)=>setSkills(e.target.value)} />

                  <button className="tl-primary" type="submit">
                    {editingId ? "💾 Update Project" : "🚀 Add Project"}
                  </button>
                </form>
              </div>
            </section>



            {/* ✅ MY PROJECTS */}
            <section id="my-projects" className="tl-section">
              <h2 className="tl-section-title">My Projects</h2>

              <div className="tl-card">
                {projects.length ? (
                  <div className="tl-grid two">
                    {projects.map(proj => (
                      <div key={proj.id} className="tl-card">
                        <h4 className="tl-card-title">{proj.title}</h4>
                        <p>{proj.description}</p>
                        <p>💰 Budget: ₹{proj.budget}</p>
                        <p>⏳ Duration: {proj.duration}</p>

                        <div className="tl-actions">
                          <button className="tl-primary" onClick={()=>handleEdit(proj)}>✏️ Edit</button>
                          <button className="tl-ghost" onClick={()=>handleDelete(proj.id)}>🗑 Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p>No projects found.</p>}
              </div>
            </section>



            {/* ✅ PROPOSALS */}
            <section id="proposals" className="tl-section">
              <h2 className="tl-section-title">Proposals Received</h2>

              <div className="tl-card">
                {proposals.length ? (
                  <div className="tl-grid two">
                    {proposals.map(p => (
                      <div key={p.id} className={`tl-card ${p.status}`}>
                        <h4 className="tl-card-title">{p.project_title}</h4>
                        <p><b>Freelancer:</b> {p.freelancer_name}</p>
                        <p><b>Price:</b> ₹{p.price}</p>
                        <p>{p.description}</p>
                        <p className={`status ${p.status}`}>{p.status}</p>

                        {p.status === "pending" && (
                          <div className="tl-actions">
                            <button className="tl-primary" onClick={()=>handleStatusChange(p,"accepted")}>✅ Accept</button>
                            <button className="tl-ghost" onClick={()=>handleStatusChange(p,"rejected")}>❌ Reject</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : <p>No proposals found.</p>}
              </div>
            </section>
                  {/* ✅ CONTRACTS */}
<section id="contracts" className="tl-section">
  <h2 className="tl-section-title">Contracts</h2>

  <div className="tl-card">
    {contracts.length ? (
      <div className="tl-grid two">
        {contracts.map((c) => (
          <div key={c.id} className={`tl-card ${c.status}`}>
            <h4 className="tl-card-title">
              {c.project_title}
            </h4>

            <p><b>Freelancer:</b> {c.freelancer_name}</p>
            <p><b>Status:</b> {c.status}</p>
            <p><b>Start:</b> {c.start_date} | <b>End:</b> {c.end_date}</p>
            <p>{c.terms}</p>

            {/* ✅ Chat */}
            <a href={`/chat/${c.id}`}>
              <button className="chat-btn">💬 Chat</button>
            </a>

            {/* ✅ Mark Completed */}
            {c.status === "active" && (
              <button
                className="tl-primary"
                onClick={() => markAsCompleted(c.id)}
              >
                ✅ Mark Completed
              </button>
            )}

            {/* ✅ Make Review */}
            {c.status === "completed" && (
              <button
                className="tl-primary"
                onClick={() =>
                  setShowReviewBox(showReviewBox === c.id ? null : c.id)
                }
              >
                ⭐ Make Review
              </button>
            )}

            {/* ✅ Review Popup */}
            {showReviewBox === c.id && (
              <div className="review-slide-box">
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        cursor: "pointer",
                        fontSize: "28px",
                        color:
                          star <= (hoverRating || reviewRating)
                            ? "#FFD700"
                            : "#ccc",
                        transition: "color 0.2s ease",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <textarea
                  className="tl-field"
                  placeholder="Write your review…"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />

                <div className="review-actions">
                  <button
                    className="tl-primary"
                    onClick={() =>
                      handleSubmitReview({
                        ...c,
                        newComment: reviewComment,
                        newRating: reviewRating,
                      })
                    }
                  >
                    ✅ Submit
                  </button>

                  <button
                    className="tl-ghost"
                    onClick={() => setShowReviewBox(null)}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p>No contracts found.</p>
    )}
  </div>
</section>



            


          </div>
        </main>
      </>
    )}
  </div>
);
}