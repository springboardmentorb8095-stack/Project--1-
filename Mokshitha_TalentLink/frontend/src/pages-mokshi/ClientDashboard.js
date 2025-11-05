import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ClientDashboard.css";
import NotificationBox from "./NotificationBox";
import { useNavigate } from "react-router-dom";

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("post");
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

const [reviewText, setReviewText] = useState("");
const [rating, setRating] = useState("");
const [submittedReviews, setSubmittedReviews] = useState([]);
const [showReviewBox, setShowReviewBox] = useState(null); // which contract review box is open
const [reviewRating, setReviewRating] = useState(0);
const [hoverRating, setHoverRating] = useState(0);
const [reviewComment, setReviewComment] = useState("");
const navigate = useNavigate();

// ✅ Open Reviews tab automatically if URL hash is #reviews
useEffect(() => {
  const checkHash = () => {
    if (window.location.hash === "#reviews") {
      setActiveTab("reviews");
    }
  };

  // Run once after initial render
  checkHash();

  // Run again when hash changes dynamically
  window.addEventListener("hashchange", checkHash);

  return () => window.removeEventListener("hashchange", checkHash);
}, []);


  const profileId = localStorage.getItem("profileId");
  const username =
    localStorage.getItem("profileName") ||
    localStorage.getItem("username") ||
    "";

  // ✅ Fetch Projects
  const fetchProjects = useCallback(async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/projects/");
      const myProjects = res.data.filter(
        (p) => p.owner === parseInt(profileId)
      );
      setProjects(myProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  }, [profileId]);

  // ✅ Fetch Proposals
  const fetchProposals = useCallback(async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/proposals/");
      setProposals(res.data);
    } catch (err) {
      console.error("Error fetching proposals:", err);
    }
  }, []);

  // ✅ Fetch Contracts (Main Fix)
  const fetchContracts = useCallback(async () => {
  setLoading(true);
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/contracts/");
    const storedName =
  (localStorage.getItem("profileName") ||
   localStorage.getItem("username") ||
   "").trim().toLowerCase();

console.log("🔍 Matching contracts for client:", storedName);

const filtered = res.data.filter((c) => {
  const clientName = (c.client_name || "").trim().toLowerCase();
  console.log("🧩 Comparing:", clientName, "vs", storedName);
  return clientName === storedName;
});

console.log("✅ Found contracts:", filtered);
setContracts(filtered);

  } catch (err) {
    console.error("Error fetching contracts:", err);
  }
  setLoading(false);
}, []);


  // ✅ Initial Load
  useEffect(() => {
    console.log("🔹 Logged-in client:", username);
    fetchProjects();
    fetchProposals();
    fetchContracts();
  }, [fetchProjects, fetchProposals, fetchContracts, username]);

  // ✅ Add / Edit Project
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

  // ✅ Edit / Delete
  const handleEdit = (proj) => {
    setEditingId(proj.id);
    setTitle(proj.title);
    setDescription(proj.description);
    setBudget(proj.budget);
    setDuration(proj.duration);
    setSkills(proj.skills_required?.map((s) => s.name).join(", ") || "");
    setActiveTab("post");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project?")) {
      await axios.delete(`http://127.0.0.1:8000/api/projects/${id}/`);
      fetchProjects();
    }
  };

  // ✅ Accept / Reject proposal + Auto Contract Create
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
          terms: "Standard contract terms apply.",
        });
        alert("📜 Contract created successfully!");
        fetchContracts();
      }

      fetchProposals();
    } catch (err) {
      console.error("Error updating proposal:", err);
    }
  };

  // ✅ Mark Contract as Completed
  const markAsCompleted = async (id) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/contracts/${id}/`, {
        status: "completed",
      });
      alert("✅ Contract marked as completed!");
      fetchContracts();
    } catch (err) {
      console.error("Error updating contract:", err);
    }
  };
  //....................
  const handleSubmitReview = async (contract) => {
  const reviewerId = localStorage.getItem("profileId");
  const reviewerName = localStorage.getItem("profileName");

  // find the freelancer by name to get their profile ID
  let revieweeId = null;
  try {
    const profilesRes = await axios.get("http://127.0.0.1:8000/api/profiles/");
    const freelancerProfile = profilesRes.data.find(
      (p) => p.user_name === contract.freelancer_name
    );
    if (freelancerProfile) revieweeId = freelancerProfile.id;
  } catch (err) {
    console.error("Error fetching profiles:", err);
  }

  if (!revieweeId) {
    alert("❌ Could not find freelancer profile!");
    return;
  }

  const payload = {
    reviewer: reviewerId,
    reviewee: revieweeId,
    project: contract.project || contract.id, // handles both cases
    rating: contract.newRating || 5, // or get from user input if you have a rating field
    comment: contract.newComment || "Great work!", // or your actual input value
  };

  console.log("📦 Final Review Payload:", payload);

  try {
    const res = await axios.post("http://127.0.0.1:8000/api/reviews/", payload);
    alert("✅ Review submitted successfully!");
    setReviewComment(""); // clears text box after submission
    setShowReviewBox(null);

    console.log("🟢 Response:", res.data);
  } catch (error) {
    console.error("❌ Error submitting review:", error.response?.data || error.message);
    alert("❌ Failed to submit review! Check console for details.");
  }
};

// -------------Back button ------------
const handleBack = () => {
  // 👇 Check if we’re not already on Profile tab
  if (activeTab !== "profile" && setActiveTab) {
    setActiveTab("profile"); // go back to profile tab
  } else {
    navigate("/"); // if already on profile, go to homepage
  }
};


  // -------------------- UI --------------------
  return (
    <div className="client-dashboard">
      <h1>💼 Client Dashboard</h1>
      
<button className="back-btn" onClick={handleBack}>← Back</button>

       <NotificationBox />

      <p>Manage your projects, proposals, and contracts.</p>

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
          📩 Proposals
        </button>
        <button
          className={activeTab === "contracts" ? "active" : ""}
          onClick={() => setActiveTab("contracts")}
        >
          📜 Contracts
        </button>
      </div>

      {/* POST PROJECT TAB */}
      {activeTab === "post" && (
        <div className="project-form">
          <h2>{editingId ? "✏️ Edit Project" : "🆕 Post a New Project"}</h2>
          <form onSubmit={handleProjectSubmit}>
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

      {/* MY PROJECTS TAB */}
      {activeTab === "my-projects" && (
        <div className="my-projects">
          <h2>📋 My Projects</h2>
          {projects.length ? (
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
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      )}

      {/* PROPOSALS TAB */}
      {activeTab === "proposals" && (
        <div className="proposals-section">
          <h2>📩 Proposals Received</h2>
          {proposals.length ? (
            <div className="proposal-grid">
              {proposals.map((p) => (
                <div key={p.id} className="proposal-card">
                  <h3>{p.project_title}</h3>
                  <p><b>Freelancer:</b> {p.freelancer_name}</p>
                  <p><b>Price:</b> ₹{p.price}</p>
                  <p>{p.description}</p>
                  <p>
                    <b>Status:</b>{" "}
                    <span className={`status ${p.status}`}>{p.status}</span>
                  </p>

                  {p.status === "pending" && (
                    <div className="proposal-actions">
                      <button onClick={() => handleStatusChange(p, "accepted")}>
                        ✅ Accept
                      </button>
                      <button onClick={() => handleStatusChange(p, "rejected")}>
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No proposals found.</p>
          )}
        </div>
      )}

      
      {/* ✅ CONTRACTS TAB */}
{activeTab === "contracts" && (
  <div className="contracts-section">
    <h2>📜 Contracts</h2>
    {loading ? (
      <p>Loading contracts...</p>
    ) : contracts.length ? (
      <div className="contract-grid">
        {contracts.map((c) => (
          <div key={c.id} className={`contract-card ${c.status}`}>
            <h3>{c.project_title}</h3>
            <p><b>Freelancer:</b> {c.freelancer_name}</p>
            <p><b>Status:</b> <span className={`status ${c.status}`}>{c.status}</span></p>
            <p><b>Start:</b> {c.start_date}</p>
            <p><b>End:</b> {c.end_date}</p>
            <p className="terms">{c.terms}</p>

            {c.status === "active" && (
              <button className="complete-btn" onClick={() => markAsCompleted(c.id)}>
                ✅ Mark as Completed
              </button>
            )}

            {/* 💬 Chat button */}
            <Link to={`/chat/${c.id}`}>
              <button className="chat-btn">💬 Chat</button>
            </Link>

            {c.status === "completed" && (
  <button
    className="review-btn"
    onClick={() =>
      setShowReviewBox(showReviewBox === c.id ? null : c.id)
    }
  >
    ⭐ Make Review
  </button>
)}

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
          star <= (hoverRating || reviewRating) ? "#FFD700" : "#ccc",
        transition: "color 0.2s ease",
      }}
    >
      ★
    </span>
  ))}
</div>


    <textarea
      placeholder="Write your review..."
      value={reviewComment}
      onChange={(e) => setReviewComment(e.target.value)}
    />
    <div className="review-actions">
      <button
        onClick={() =>
          handleSubmitReview({
            ...c,
            newComment: reviewComment,
            newRating: reviewRating,
          })
        }
        className="submit-btn"
      >
        ✅ Submit
      </button>
      <button
        className="cancel-btn"
        onClick={() => setShowReviewBox(null)}
      >
        ❌ Cancel
      </button>
    </div>
  </div>
)}


            {/* ⭐ Review Section (only when completed) */}
            
      

            {/* ✅ Show confirmation if review submitted */}
            {submittedReviews.includes(c.id) && (
              <p className="review-confirmed">⭐ Review Submitted!</p>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p>No contracts found.</p>
    )}
  </div>
)}

    </div>
  );
}
