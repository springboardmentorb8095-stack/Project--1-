import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NotificationBox from "./NotificationBox";
import { useNavigate } from "react-router-dom";

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
  const [reviews, setReviews] = useState([]);

  const [filterSkill, setFilterSkill] = useState("");
  const [filterBudget, setFilterBudget] = useState("");
  const [filterDuration, setFilterDuration] = useState("");

  const [showWelcome, setShowWelcome] = useState(true);
  const navigate = useNavigate();
  const profileId = localStorage.getItem("profileId");

  // Welcome splash auto-hide
  useEffect(() => {
    const t = setTimeout(() => setShowWelcome(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!profileId) return;
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/profiles/${profileId}/`);
      setProfile(res.data || {});
      const skillNames =
        (Array.isArray(res.data?.skills) ? res.data.skills.map(s=>s.name).join(", ") : "") ||
        (Array.isArray(res.data?.skill_names) ? res.data.skill_names.join(", ") : "") || "";
      setSkillsInput(skillNames);
    } catch (err) { console.error(err); }
  }, [profileId]);

  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/projects/");
      setProjects(res.data || []);
      setFilteredProjects(res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoadingProjects(false); }
  }, []);

  const fetchMyProposals = useCallback(async () => {
    if (!profileId) return;
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/proposals/");
      setMyProposals((res.data || []).filter(p => Number(p.freelancer) === Number(profileId)));
    } catch (err) { console.error(err); }
  }, [profileId]);

  const fetchContracts = useCallback(async () => {
    if (!profile?.user_name) return;
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/contracts/");
      const mine = (res.data || []).filter(c => {
        if (c.freelancer === Number(profileId)) return true;
        if (c.freelancer_name && profile.user_name) {
          return c.freelancer_name.toLowerCase() === profile.user_name.toLowerCase();
        }
        return false;
      });
      setContracts(mine);
    } catch (err) { console.error(err); }
  }, [profile, profileId]);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/reviews/");
      const storedName =
        (localStorage.getItem("profileName") ||
         localStorage.getItem("freelancerProfileName") ||
         "").trim().toLowerCase();
      setReviews((res.data || []).filter(r => r.reviewee_name?.toLowerCase() === storedName));
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchProfile(); fetchProjects(); fetchMyProposals(); }, [fetchProfile, fetchProjects, fetchMyProposals]);
  useEffect(() => { fetchContracts(); }, [fetchContracts]);
  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleProfileUpdate = async () => {
    try {
      const skillsList = skillsInput.split(",").map(s=>s.trim()).filter(Boolean);
      const payload = {
        user_name: profile.user_name || "",
        email: profile.email || "",
        bio: profile.bio || "",
        portfolio: profile.portfolio || "",
        hourly_rate: profile.hourly_rate || "500",
        availability: profile.availability || "available",
        is_client: false,
        is_freelancer: true,
        skill_names: skillsList,
      };
      await axios.put(`http://127.0.0.1:8000/api/profiles/${profileId}/`, payload);
      setProfile({ ...profile, skills_details: skillsList.map((s,i)=>({id:i+1, name:s})) });
      setEditing(false);
      alert("✅ Profile updated.");
    } catch (err) { console.error(err); alert("❌ Failed to update profile."); }
  };

  const handleProposalSubmit = async (projectId) => {
    if (!proposalText || !proposalPrice) { alert("Please fill both fields."); return; }
    try {
      await axios.post("http://127.0.0.1:8000/api/proposals/", {
        project: projectId,
        freelancer: Number(profileId),
        description: proposalText,
        price: proposalPrice,
      });
      setProposalText(""); setProposalPrice(""); setSelectedProject(null);
      fetchMyProposals();
      alert("✅ Proposal sent!");
    } catch (err) { console.error(err); alert("❌ Failed to submit proposal."); }
  };

  const handleFilter = () => {
    let results = Array.isArray(projects) ? [...projects] : [];
    if (filterSkill.trim()) {
      const q = filterSkill.trim().toLowerCase();
      results = results.filter(p =>
        Array.isArray(p.skills_required) &&
        p.skills_required.some(s => (s?.name || "").toLowerCase().includes(q))
      );
    }
    if (filterBudget.trim()) {
      const max = parseFloat(filterBudget) || 0;
      results = results.filter(p => parseFloat(p.budget || 0) <= max);
    }
    if (filterDuration.trim()) {
      const qd = filterDuration.trim().toLowerCase();
      results = results.filter(p => (p.duration || "").toLowerCase().includes(qd));
    }
    setFilteredProjects(results);
  };

  const resetFilter = () => {
    setFilterSkill(""); setFilterBudget(""); setFilterDuration("");
    setFilteredProjects(projects);
  };

  const initials = (name="") => name ? name.trim().split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() : "F";
  const handleBack = () => { if (activeTab !== "profile") setActiveTab("profile"); else navigate("/"); };
  const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
};


  return (
    <div className="tl-shell">
      {/* NAV */}
      <header className="tl-nav">
        <div className="tl-nav-inner">
          <a href="/" className="tl-brand">TalentLink</a>
         <div className="tabs-row">
  <button className="tab" onClick={() => scrollToSection("profile")}>Profile</button>
  <button className="tab" onClick={() => scrollToSection("projects")}>Browse Projects</button>
  <button className="tab" onClick={() => scrollToSection("proposals")}>My Proposals</button>
  <button className="tab" onClick={() => scrollToSection("contracts")}>My Contracts</button>
  <button className="tab" onClick={() => scrollToSection("reviews")}>⭐ Reviews</button>
</div>

          <div className="tl-nav-right">
            <NotificationBox placement="nav" />
            <button className="tl-btn" onClick={handleBack}>← Back</button>
            <button className="tl-btn danger" onClick={()=>{localStorage.clear(); navigate("/");}}>Logout</button>
          </div>
        </div>
      </header>

      {/* HERO BAR */}
      <section className="tl-hero">
        <div className="tl-hero-inner">
          <div>
            <h2 className="tl-hero-title">Freelancer Workspace</h2>
            <div className="tl-hero-sub">Manage your profile, discover projects, send proposals, chat and track contracts.</div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="tl-main">
        <div className="tl-main-inner">
          {/* PROFILE */}
         
            <section id ="profile" className="tl-section">
              <div className="tl-card">
                {!editing ? (
                  <div className="tl-profile">
                    <div className="tl-avatar">{initials(profile.user_name)}</div>
                    <div style={{flex:1}}>
                      <div className="tl-card-header">
                        <h3 className="tl-card-title">{profile.user_name}</h3>
                        <div className="tl-kpis">
                          <span className="pill money">₹{profile.hourly_rate || "500"}/hr</span>
                          <span className={`pill ${profile.availability || "available"}`}>{profile.availability || "available"}</span>
                        </div>
                      </div>
                      <div style={{color:"var(--muted)"}}>{profile.email}</div>

                      <div style={{marginTop:14}}>
                        <h4 className="tl-section-title">About</h4>
                        <div style={{color:"var(--slate-900)"}}>{profile.bio || "Not provided yet"}</div>
                      </div>

                      <div style={{marginTop:14}}>
                        <h4 className="tl-section-title">Skills</h4>
                        <div className="tl-row">
                          {profile.skills_details?.length
                            ? profile.skills_details.map((s,i)=><span key={i} className="skill-chip">{s.name}</span>)
                            : <span style={{color:"var(--muted)"}}>No skills added</span>}
                        </div>
                      </div>

                      {profile.portfolio && (
                        <div style={{marginTop:14}}>
                          <h4 className="tl-section-title">Portfolio</h4>
                          <a href={profile.portfolio} target="_blank" rel="noreferrer" className="tl-ghost">{profile.portfolio}</a>
                        </div>
                      )}

                      <div className="tl-actions" style={{marginTop:16}}>
                        <button className="tl-primary" onClick={()=>setEditing(true)}>✏️ Edit Profile</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="tl-grid two">
                    <div className="tl-card">
                      <div className="tl-row">
                        <input className="tl-field" placeholder="Full name" value={profile.user_name || ""} onChange={e=>setProfile({...profile, user_name:e.target.value})}/>
                        <input className="tl-field" placeholder="Email" value={profile.email || ""} onChange={e=>setProfile({...profile, email:e.target.value})}/>
                      </div>
                      <textarea className="tl-field" rows={4} placeholder="Short bio" value={profile.bio || ""} onChange={e=>setProfile({...profile, bio:e.target.value})}/>
                      <div className="tl-row">
                        <input className="tl-field" placeholder="Portfolio link" value={profile.portfolio || ""} onChange={e=>setProfile({...profile, portfolio:e.target.value})}/>
                        <input className="tl-field" placeholder="Skills (comma separated)" value={skillsInput} onChange={e=>setSkillsInput(e.target.value)}/>
                      </div>
                      <div className="tl-row">
                        <input className="tl-field" placeholder="Hourly rate" value={profile.hourly_rate || ""} onChange={e=>setProfile({...profile, hourly_rate:e.target.value})}/>
                        <select className="tl-field" value={profile.availability || "available"} onChange={e=>setProfile({...profile, availability:e.target.value})}>
                          <option value="available">Available</option>
                          <option value="part_time">Part-time</option>
                          <option value="busy">Busy</option>
                        </select>
                      </div>
                      <div className="tl-actions" style={{marginTop:10}}>
                        <button className="tl-primary" onClick={handleProfileUpdate}>💾 Save</button>
                        <button className="tl-ghost" onClick={()=>{ setEditing(false); fetchProfile(); }}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
        

          {/* PROJECTS */}
          
            <section id="projects" className="tl-section">
                <h1 className="tl-section-title">Browse Projects</h1>

              <div className="tl-card">
                <div className="tl-card-header">
                  <div className="tl-row">
                    <input className="tl-field" placeholder="Skill (e.g. React)" value={filterSkill} onChange={e=>setFilterSkill(e.target.value)}/>
                    <input className="tl-field" placeholder="Max budget (₹)" value={filterBudget} onChange={e=>setFilterBudget(e.target.value)}/>
                    <input className="tl-field" placeholder="Duration (e.g. 2 weeks)" value={filterDuration} onChange={e=>setFilterDuration(e.target.value)}/>
                    <button className="tl-primary" onClick={handleFilter}>Apply</button>
                    <button className="tl-ghost" onClick={resetFilter}>Reset</button>
                  </div>
                </div>

                {loadingProjects ? <p>Loading projects...</p> : (
                  filteredProjects.length ? (
                    <div className="tl-grid two">
                      {filteredProjects.map(proj=>(
                        <div key={proj.id} className="tl-card">
                          <div className="tl-card-header">
                            <h4 className="tl-card-title">{proj.title}</h4>
                            <div className="proj-meta">
                              {(proj.skills_required || []).map(s=><span key={s.id} className="skill-chip">{s.name}</span>)}
                            </div>
                          </div>
                          <div style={{color:"var(--slate-900)"}}>{proj.description}</div>
                          <div className="proj-meta" style={{marginTop:10}}>
                            <span>💰 <b>Budget:</b> ₹{proj.budget || "0"}</span>
                            <span>⏳ <b>Duration:</b> {proj.duration || "—"}</span>
                          </div>
                          <div className="tl-actions" style={{marginTop:12}}>
                            <button className="tl-primary" onClick={()=> setSelectedProject(selectedProject===proj.id ? null : proj.id)}>
                              {selectedProject===proj.id ? "Close" : "Submit Proposal"}
                            </button>
                          </div>

                          {selectedProject===proj.id && (
                            <div className="tl-proposal">
                              <textarea className="tl-field" rows={3} placeholder="Short proposal (what you'll deliver)" value={proposalText} onChange={e=>setProposalText(e.target.value)}/>
                              <div className="tl-row" style={{marginTop:8}}>
                                <input className="tl-field" placeholder="Your price (₹)" value={proposalPrice} onChange={e=>setProposalPrice(e.target.value)}/>
                                <button className="tl-primary" onClick={()=>handleProposalSubmit(proj.id)}>Send Proposal</button>
                                <button className="tl-ghost" onClick={()=>{ setSelectedProject(null); setProposalText(""); setProposalPrice(""); }}>Cancel</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : <p>No projects found.</p>
                )}
              </div>
            </section>
          

          {/* PROPOSALS */}
          
            <section id ="proposals" className="tl-section">
                <h1 className="tl-section-title">My Proposals</h1>

              <div className="tl-card">
                {myProposals.length ? (
                  <div className="tl-grid two">
                    {myProposals.map(p=>(
                      <div key={p.id} className="tl-card">
                        <div className="tl-card-header">
                          <h4 className="tl-card-title">{p.project_title || `Project #${p.project}`}</h4>
                          <span className={`status ${p.status || "pending"}`}>{(p.status || "pending").toUpperCase()}</span>
                        </div>
                        <div>💰 <b>Price:</b> ₹{p.price}</div>
                        <div style={{marginTop:8}}>{p.description}</div>
                      </div>
                    ))}
                  </div>
                ) : <p>No proposals yet.</p>}
              </div>
            </section>
          

          {/* CONTRACTS */}
          
            <section id="contracts"className="tl-section">
                <h1 className="tl-section-title">My Contracts</h1>

              <div className="tl-card">
                {contracts.length ? (
                  <div className="tl-grid two">
                    {contracts.map(c=>(
                      <div key={c.id} className="tl-card">
                        <div className="tl-card-header">
                          <h4 className="tl-card-title">{c.project_title || `Project #${c.proposal?.project}`}</h4>
                          <span className={`status ${c.status || ""}`}>{(c.status||"").toUpperCase()}</span>
                        </div>
                        <div><b>Client:</b> {c.client_name || c.client}</div>
                        <div><b>Start:</b> {c.start_date} &nbsp; <b>End:</b> {c.end_date || "—"}</div>
                        <div style={{marginTop:8}}>{c.terms}</div>
                        <div className="tl-actions" style={{marginTop:12}}>
                          <a href={`/chat/${c.id}`}><button className="chat-btn">💬 Chat</button></a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p>No contracts yet.</p>}
              </div>
            </section>
          

          {/* REVIEWS */}
         
            <section id="reviews"className="tl-section">
                <h1 className="tl-section-title">Client Reviews</h1>

              <div className="tl-card">
                {reviews.length ? (
                  <div className="tl-grid two">
                    {reviews.map(r=>(
                      <div key={r.id} className="review-card">
                        <h4 className="tl-card-title">{r.project_title}</h4>
                        <div className="review-meta">
                          <span>⭐ {r.rating}/5</span>
                          <span>From: <b>{r.reviewer_name}</b></span>
                        </div>
                        <div style={{marginTop:8}}>{r.comment}</div>
                      </div>
                    ))}
                  </div>
                ) : <p>No reviews yet.</p>}
              </div>
            </section>
          
        </div>
      </main>

      {/* Welcome splash (auto hides) */}
      {showWelcome && (
        <div className="welcome">
          <div className="welcome-card">
            <div className="welcome-title">Welcome to Freelancer Dashboard</div>
            <div className="welcome-sub">Loading your workspace…</div>
          </div>
        </div>
      )}
    </div>
  );
}
