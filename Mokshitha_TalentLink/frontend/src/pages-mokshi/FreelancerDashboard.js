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
  const [loadingProjects, setLoadingProjects] = useState(false);

  const [proposalText, setProposalText] = useState("");
  const [proposalPrice, setProposalPrice] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  const [myProposals, setMyProposals] = useState([]);
  const [contracts, setContracts] = useState([]);

  const [filterSkill, setFilterSkill] = useState("");
  const [filterBudget, setFilterBudget] = useState("");
  const [filterDuration, setFilterDuration] = useState("");

  const profileId = localStorage.getItem("profileId"); // must be set at login/register

  // ---------------- Fetchers ----------------
  const fetchProfile = useCallback(async () => {
    if (!profileId) return;
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/profiles/${profileId}/`);
      setProfile(res.data || {});
      // combine possible formats
      const skillNames =
        (res.data?.skills_details?.map((s) => s.name).join(", ")) ||
        (Array.isArray(res.data?.skills) ? res.data.skills.join(", ") : "") ||
        "";
      setSkillsInput(skillNames);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }, [profileId]);

  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/projects/");
      setProjects(res.data || []);
      setFilteredProjects(res.data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  const fetchMyProposals = useCallback(async () => {
    if (!profileId) return;
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/proposals/");
      const mine = (res.data || []).filter((p) => Number(p.freelancer) === Number(profileId));
      setMyProposals(mine);
    } catch (err) {
      console.error("Error fetching proposals:", err);
    }
  }, [profileId]);

  const fetchContracts = useCallback(async () => {
    if (!profile?.user_name) return;
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/contracts/");
      // match by freelancer id or name depending what API returns. Try robust checks:
      const all = res.data || [];
      const mine = all.filter((c) => {
        if (c.freelancer === Number(profileId)) return true;
        if (c.freelancer_name && profile.user_name) {
          return c.freelancer_name.toLowerCase() === profile.user_name.toLowerCase();
        }
        return false;
      });
      setContracts(mine);
    } catch (err) {
      console.error("Error fetching contracts:", err);
    }
  }, [profile, profileId]);

  // initial load
  useEffect(() => {
    fetchProfile();
    fetchProjects();
    fetchMyProposals();
    // fetchContracts depends on profile (name), so call after profile set in another effect
  }, [fetchProfile, fetchProjects, fetchMyProposals]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // ---------------- Profile update ----------------
  const handleProfileUpdate = async () => {
    try {
      const skillsList = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = {
        user_name: profile.user_name || "",
        email: profile.email || "",
        bio: profile.bio || "",
        portfolio: profile.portfolio || "",
        hourly_rate: profile.hourly_rate || profile.hourly_rate || "500",
        availability: profile.availability || "available",
        is_client: false,
        is_freelancer: true,
        // backend expects `skills` (list of strings) for the serializer we built earlier
        skills: skillsList,
      };

      await axios.put(`http://127.0.0.1:8000/api/profiles/${profileId}/`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      // update UI immediately
      setProfile({
        ...profile,
        skills_details: skillsList.map((s, i) => ({ id: i + 1, name: s })),
      });

      setEditing(false);
      alert("✅ Profile updated.");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Failed to update profile.");
    }
  };

  // ---------------- Proposal submit ----------------
  const handleProposalSubmit = async (projectId) => {
    if (!proposalText || !proposalPrice) {
      alert("Please fill both message and price.");
      return;
    }
    try {
      await axios.post("http://127.0.0.1:8000/api/proposals/", {
        project: projectId,
        freelancer: Number(profileId),
        description: proposalText,
        price: proposalPrice,
      });
      alert("✅ Proposal sent!");
      setProposalText("");
      setProposalPrice("");
      setSelectedProject(null);
      fetchMyProposals();
    } catch (err) {
      console.error("Error submitting proposal:", err);
      alert("❌ Failed to submit proposal.");
    }
  };

  // ---------------- Filters ----------------
  const handleFilter = () => {
    let results = Array.isArray(projects) ? [...projects] : [];

    if (filterSkill.trim()) {
      const q = filterSkill.trim().toLowerCase();
      results = results.filter((p) => {
        if (!Array.isArray(p.skills_required)) return false;
        return p.skills_required.some((s) => (s?.name || "").toLowerCase().includes(q));
      });
    }

    if (filterBudget.trim()) {
      const max = parseFloat(filterBudget) || 0;
      results = results.filter((p) => parseFloat(p.budget || 0) <= max);
    }

    if (filterDuration.trim()) {
      const qd = filterDuration.trim().toLowerCase();
      results = results.filter((p) => (p.duration || "").toLowerCase().includes(qd));
    }

    setFilteredProjects(results);
  };

  const resetFilter = () => {
    setFilterSkill("");
    setFilterBudget("");
    setFilterDuration("");
    setFilteredProjects(projects);
  };

  const initials = (name = "") => {
    if (!name) return "F";
    return name.trim().split(" ").map((n) => n[0]).join("").slice(0,2).toUpperCase();
  };

  // ---------------- Render ----------------
  return (
    <div className="freelancer-dashboard-root">
      <h1>🧑‍💻 Freelancer Dashboard</h1>

      <div className="tabs-row">
        <button className={activeTab === "profile" ? "tab active" : "tab"} onClick={() => setActiveTab("profile")}>Profile</button>
        <button className={activeTab === "projects" ? "tab active" : "tab"} onClick={() => setActiveTab("projects")}>Browse Projects</button>
        <button className={activeTab === "proposals" ? "tab active" : "tab"} onClick={() => setActiveTab("proposals")}>My Proposals</button>
        <button className={activeTab === "contracts" ? "tab active" : "tab"} onClick={() => setActiveTab("contracts")}>My Contracts</button>
      </div>

      {/* ---------- PROFILE ---------- */}
      {activeTab === "profile" && (
        <div className="profile-pane">
          {!editing ? (
            <div className="profile-card">
              <div className="avatar">{initials(profile.user_name)}</div>
              <h2 className="p-name">{profile.user_name}</h2>
              <p className="p-email">{profile.email}</p>

              <div className="p-badges">
                <span className="badge money">₹{profile.hourly_rate || "500"}/hr</span>
                <span className={`badge avail ${profile.availability || "available"}`}>{profile.availability || "available"}</span>
              </div>

              <h3>About</h3>
              <p className="p-bio">{profile.bio || "Not provided yet"}</p>

              <h3>Skills</h3>
              <div className="skills-block">
                {profile.skills_details?.length ? profile.skills_details.map((s) => (
                  <span key={s.id} className="skill-pill">{s.name}</span>
                )) : <span className="no-skills">No skills added</span>}
              </div>

              <div className="profile-actions">
                <button onClick={() => setEditing(true)} className="btn-edit">✏️ Edit Profile</button>
              </div>
            </div>
          ) : (
            <div className="profile-edit-card">
              <input value={profile.user_name || ""} onChange={(e)=>setProfile({...profile, user_name: e.target.value})} placeholder="Full name"/>
              <input value={profile.email || ""} onChange={(e)=>setProfile({...profile, email: e.target.value})} placeholder="Email"/>
              <textarea value={profile.bio || ""} onChange={(e)=>setProfile({...profile, bio: e.target.value})} placeholder="Short bio"/>
              <input value={profile.portfolio || ""} onChange={(e)=>setProfile({...profile, portfolio: e.target.value})} placeholder="Portfolio link"/>
              <input value={skillsInput} onChange={(e)=>setSkillsInput(e.target.value)} placeholder="Skills (comma separated)"/>
              <input value={profile.hourly_rate || ""} onChange={(e)=>setProfile({...profile, hourly_rate: e.target.value})} placeholder="Hourly rate"/>
              <select value={profile.availability || "available"} onChange={(e)=>setProfile({...profile, availability: e.target.value})}>
                <option value="available">Available</option>
                <option value="part_time">Part-time</option>
                <option value="busy">Busy</option>
              </select>

              <div className="profile-edit-actions">
                <button onClick={handleProfileUpdate} className="btn-save">💾 Save</button>
                <button onClick={()=>{ setEditing(false); fetchProfile(); }} className="btn-cancel">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------- PROJECTS ---------- */}
      {activeTab === "projects" && (
        <div className="projects-pane">
          <h2>Browse Projects</h2>

          <div className="filters">
            <input placeholder="Skill (e.g. React)" value={filterSkill} onChange={(e)=>setFilterSkill(e.target.value)} />
            <input placeholder="Max budget (₹)" value={filterBudget} onChange={(e)=>setFilterBudget(e.target.value)} />
            <input placeholder="Duration (e.g. 2 weeks)" value={filterDuration} onChange={(e)=>setFilterDuration(e.target.value)} />
            <button onClick={handleFilter} className="btn-apply">Apply</button>
            <button onClick={resetFilter} className="btn-reset">Reset</button>
          </div>

          {loadingProjects ? <p>Loading projects...</p> : (
            filteredProjects.length ? filteredProjects.map((proj) => (
              <div key={proj.id} className="project-card">
                <div className="project-head">
                  <h3>{proj.title}</h3>
                  <div className="project-skills">
                    {(proj.skills_required || []).map((s)=>(<span key={s.id} className="skill-pill small">{s.name}</span>))}
                  </div>
                </div>

                <p className="project-desc">{proj.description}</p>
                <div className="project-meta">
                  <div>💰 <b>Budget:</b> ₹{proj.budget || "0"}</div>
                  <div>⏳ <b>Duration:</b> {proj.duration || "—"}</div>
                </div>

                <div className="project-actions">
                  <button onClick={()=> setSelectedProject(selectedProject===proj.id? null : proj.id)} className="btn-propose">
                    {selectedProject === proj.id ? "Close" : "Submit Proposal"}
                  </button>
                </div>

                {selectedProject === proj.id && (
                  <div className="proposal-box">
                    <textarea placeholder="Write a short proposal (what you'll deliver)" value={proposalText} onChange={(e)=>setProposalText(e.target.value)} />
                    <input placeholder="Your price (₹)" value={proposalPrice} onChange={(e)=>setProposalPrice(e.target.value)} />
                    <div className="proposal-buttons">
                      <button onClick={()=> handleProposalSubmit(proj.id)} className="btn-send">Send Proposal</button>
                      <button onClick={()=>{ setSelectedProject(null); setProposalText(""); setProposalPrice(""); }} className="btn-cancel">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )) : <p>No projects found.</p>
          )}
        </div>
      )}

      {/* ---------- MY PROPOSALS ---------- */}
      {activeTab === "proposals" && (
        <div className="proposals-pane">
          <h2>My Proposals</h2>
          {myProposals.length ? myProposals.map((p) => (
            <div key={p.id} className={`my-proposal-card ${p.status || ""}`}>
              <div className="proposal-top">
                <h3>{p.project_title || `Project #${p.project}`}</h3>
                <span className={`status ${p.status || "pending"}`}>{(p.status || "pending").toUpperCase()}</span>
              </div>
              <p className="proposal-price"><b>Price:</b> ₹{p.price}</p>
              <p className="proposal-body">{p.description}</p>
            </div>
          )) : <p>No proposals submitted yet.</p>}
        </div>
      )}

      {/* ---------- MY CONTRACTS ---------- */}
      {activeTab === "contracts" && (
        <div className="contracts-pane">
          <h2>My Contracts</h2>
          {contracts.length ? contracts.map((c) => (
            <div key={c.id} className={`contract-card ${c.status || ""}`}>
              <h3>{c.project_title || `Project #${c.proposal?.project}`}</h3>
              <p><b>Client:</b> {c.client_name || c.client}</p>
              <p><b>Status:</b> <span className={`status ${c.status || ""}`}>{(c.status||"").toUpperCase()}</span></p>
              <p><b>Start:</b> {c.start_date}</p>
              <p><b>End:</b> {c.end_date}</p>
              <p className="contract-terms">{c.terms}</p>
              {/* ✅ Chat Button */}
          <a href={`/chat/${c.id}`}>
            <button className="chat-btn">💬 Chat</button>
          </a>
            </div>
          )) : <p>No contracts yet.</p>}
        </div>
        
      )}
    </div>
  );
}

