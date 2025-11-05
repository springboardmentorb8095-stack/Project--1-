// src/pages/ProfilesPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css"; // reuse your existing styles

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [availability, setAvailability] = useState("");

  // Fetch profiles from backend API
  const fetchProfiles = async () => {
    try {
      let url = `http://127.0.0.1:8000/users/profiles/search/?search=${search}`;
      if (role) url += `&role=${role}`;
      if (availability) url += `&availability=${availability}`;
      const res = await axios.get(url);
      setProfiles(res.data);
    } catch (err) {
      console.error("Error fetching profiles:", err);
    }
  };

  // Optional: load all profiles initially
  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">🔍 Search Freelancers</h2>

      {/* Search and Filters */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by username or skills"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        >
          <option value="">All Roles</option>
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
        </select>

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        >
          <option value="">All Availability</option>
          <option value="available">Available</option>
          <option value="not available">Not Available</option>
        </select>

        <button
          onClick={fetchProfiles}
          style={{
            padding: "5px 10px",
            marginLeft: "10px",
            cursor: "pointer",
            backgroundColor: "#4b2a99",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Apply Filters
        </button>
      </div>

      {/* Profiles list */}
      <div className="dashboard-cards">
        {profiles.length === 0 && <p>No profiles found.</p>}
        {profiles.map((p) => (
          <div className="dashboard-card" key={p.id}>
            <h3>{p.user.username}</h3>
            <p><strong>Skills:</strong> {p.skills || "-"}</p>
            <p><strong>Role:</strong> {p.role}</p>
            <p><strong>Hourly Rate:</strong> ₹{p.hourly_rate || "0"}</p>
            <p><strong>Availability:</strong> {p.availability || "-"}</p>
            {p.portfolio && (
              <p>
                <a href={p.portfolio} target="_blank" rel="noopener noreferrer">
                  Portfolio
                </a>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilesPage;
