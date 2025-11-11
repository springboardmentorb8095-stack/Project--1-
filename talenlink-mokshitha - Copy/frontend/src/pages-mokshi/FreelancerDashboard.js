import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function FreelancerDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({});
  const [skillsInput, setSkillsInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [proposalText, setProposalText] = useState("");
  const [proposalPrice, setProposalPrice] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [myProposals, setMyProposals] = useState([]);
  const [filterSkill, setFilterSkill] = useState("");
  const [filterBudget, setFilterBudget] = useState("");
  const [filterDuration, setFilterDuration] = useState("");

  const profileId = localStorage.getItem("profileId");

  // ---------- Fetch Profile ----------
  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/profiles/${profileId}/`);
      setProfile(res.data);

      const skillNames =
        res.data.skills_details?.map((s) => s.name).join(", ") ||
        res.data.skills?.join(", ") ||
        "";
      setSkillsInput(skillNames);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }, [profileId]);

  // ---------- Fetch Projects ----------
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/projects/");
      setProjects(res.data);
      setFilteredProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
    setLoading(false);
  }, []);

  // ---------- Fetch My Proposals ----------
  const fetchMyProposals = useCallback(async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/proposals/");
      const filtered = res.data.filter(
        (p) => p.freelancer === parseInt(profileId)
      );
      setMyProposals(filtered);
    } catch (err) {
      console.error("Error fetching proposals:", err);
    }
  }, [profileId]);

  // ---------- useEffect ----------
  useEffect(() => {
    fetchProfile();
    fetchProjects();
    fetchMyProposals();
  }, [fetchProfile, fetchProjects, fetchMyProposals]);

  // ---------- Update Profile ----------
  const handleProfileUpdate = async () => {
    try {
      const skillList = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);

      const payload = {
        user_name: profile.user_name,
        email: profile.email,
        bio: profile.bio,
        portfolio: profile.portfolio,
        hourly_rate: profile.hourly_rate || "500",
        availability: profile.availability || "available",
        is_client: false,
        is_freelancer: true,
        skills: skillList, // ✅ Correct key
      };

      await axios.put(
        `http://127.0.0.1:8000/api/profiles/${profileId}/`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ Update UI instantly
      setProfile({
        ...profile,
        skills_details: skillList.map((s, i) => ({ id: i, name: s })),
      });

      alert("✅ Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error("❌ Update failed:", err.response?.data || err.message);
      alert("❌ Failed to update profile!");
    }
  };

  // ---------- Submit Proposal ----------
  const handleProposalSubmit = async (projectId) => {
    if (!proposalText || !proposalPrice) {
      alert("Please fill all fields before submitting!");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/proposals/", {
        project: projectId,
        freelancer: profileId,
        description: proposalText,
        price: proposalPrice,
      });

      alert("✅ Proposal submitted successfully!");
      setProposalText("");
      setProposalPrice("");
      setSelectedProject(null);
      fetchMyProposals();
    } catch (err) {
      console.error("❌ Error submitting proposal:", err);
      alert("❌ Failed to submit proposal!");
    }
  };

  // ---------- Filter Logic ----------
  const handleFilter = () => {
    let filtered = projects;

    if (filterSkill)
      filtered = filtered.filter(
        (p) =>
          Array.isArray(p.skills_required) &&
          p.skills_required.some(
            (s) =>
              s.name &&
              s.name.toLowerCase().includes(filterSkill.toLowerCase())
          )
      );

    if (filterBudget)
      filtered = filtered.filter(
        (p) => p.budget && p.budget <= parseInt(filterBudget)
      );

    if (filterDuration)
      filtered = filtered.filter(
        (p) =>
          p.duration &&
          p.duration.toLowerCase().includes(filterDuration.toLowerCase())
      );

    setFilteredProjects(filtered);
  };

  const resetFilter = () => {
    setFilterSkill("");
    setFilterBudget("");
    setFilterDuration("");
    setFilteredProjects(projects);
  };

  const initials = (name = "") => (name ? name[0].toUpperCase() : "F");

  // ---------- UI ----------
  return (
    <div className="freelancer-dashboard">
      <h1>👩‍💻 Freelancer Dashboard</h1>

      <div className="tab-buttons">
        <button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          👤 Profile
        </button>
        <button
          className={activeTab === "projects" ? "active" : ""}
          onClick={() => setActiveTab("projects")}
        >
          📂 Browse Projects
        </button>
        <button
          className={activeTab === "proposals" ? "active" : ""}
          onClick={() => setActiveTab("proposals")}
        >
          💼 My Proposals
        </button>
      </div>

      {/* ---------- PROFILE ---------- */}
      {activeTab === "profile" && (
        <div className="profile-section centered">
          {!editing ? (
            <div className="profile-card-centered">
              <div className="avatar-large">{initials(profile.user_name)}</div>
              <h2>{profile.user_name}</h2>
              <p>{profile.email}</p>
              <div className="badges">
                <span className="badge rate">₹{profile.hourly_rate}/hr</span>
                <span className={`badge avail ${profile.availability}`}>
                  {profile.availability}
                </span>
              </div>
              <h3>About</h3>
              <p className="bio">{profile.bio || "No bio provided"}</p>
              <h3>Skills</h3>
              <div className="skills-list">
                {profile.skills_details?.length ? (
                  profile.skills_details.map((s) => (
                    <span key={s.id} className="skill-tag">
                      {s.name}
                    </span>
                  ))
                ) : (
                  <span>No skills added</span>
                )}
              </div>
              <button onClick={() => setEditing(true)}>✏️ Edit Profile</button>
            </div>
          ) : (
            <div className="profile-form-centered">
              <input
                type="text"
                placeholder="Full Name"
                value={profile.user_name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, user_name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                value={profile.email || ""}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
              <textarea
                placeholder="Your Bio"
                value={profile.bio || ""}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Portfolio Link"
                value={profile.portfolio || ""}
                onChange={(e) =>
                  setProfile({ ...profile, portfolio: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Skills (comma separated)"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
              />
              <input
                type="number"
                placeholder="Hourly Rate"
                value={profile.hourly_rate || ""}
                onChange={(e) =>
                  setProfile({ ...profile, hourly_rate: e.target.value })
                }
              />
              <select
                value={profile.availability || "available"}
                onChange={(e) =>
                  setProfile({ ...profile, availability: e.target.value })
                }
              >
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="part_time">Part-time</option>
              </select>
              <button onClick={handleProfileUpdate}>💾 Save</button>
            </div>
          )}
        </div>
      )}

      {/* ---------- BROWSE PROJECTS ---------- */}
      {activeTab === "projects" && (
        <div className="projects-section">
          <h2>📂 Browse Projects</h2>
          <div className="filter-section">
            <input
              type="text"
              placeholder="Filter by skill..."
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Budget (₹)"
              value={filterBudget}
              onChange={(e) => setFilterBudget(e.target.value)}
            />
            <input
              type="text"
              placeholder="Duration (e.g. 2 weeks)"
              value={filterDuration}
              onChange={(e) => setFilterDuration(e.target.value)}
            />
            <button className="apply-btn" onClick={handleFilter}>
              Apply
            </button>
            <button className="reset-btn" onClick={resetFilter}>
              Reset
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            filteredProjects.map((proj) => (
              <div key={proj.id} className="project-card-spaced">
                <h3>{proj.title}</h3>
                <p>{proj.description}</p>
                <p>💰 Budget: ₹{proj.budget}</p>
                <p>⏳ Duration: {proj.duration}</p>
                <button onClick={() => setSelectedProject(proj.id)}>
                  💬 Submit Proposal
                </button>

                {selectedProject === proj.id && (
                  <div className="proposal-form">
                    <textarea
                      placeholder="Enter your proposal..."
                      value={proposalText}
                      onChange={(e) => setProposalText(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Enter your price"
                      value={proposalPrice}
                      onChange={(e) => setProposalPrice(e.target.value)}
                    />
                    <button
                      onClick={() => handleProposalSubmit(proj.id)}
                      className="send-btn"
                    >
                      Send Proposal
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ---------- MY PROPOSALS ---------- */}
      {activeTab === "proposals" && (
        <div className="my-proposals">
          <h2>💼 My Proposals</h2>
          {myProposals.length ? (
            myProposals.map((p) => (
              <div key={p.id} className={`proposal-card ${p.status}`}>
                <h3>{p.project_title}</h3>
                <p>
                  <b>Status:</b>{" "}
                  <span className={`status ${p.status}`}>{p.status}</span>
                </p>
                <p>
                  <b>Price:</b> ₹{p.price}
                </p>
                <p>{p.description}</p>
              </div>
            ))
          ) : (
            <p>No proposals yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
