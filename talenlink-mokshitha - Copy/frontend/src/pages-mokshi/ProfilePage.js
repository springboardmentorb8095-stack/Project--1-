import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const username = localStorage.getItem("loggedInUser");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/profiles/");
        const userProfile = response.data.find((p) => p.user_name === username);
        setProfile(userProfile);
        setFormData(userProfile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [username]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/profiles/${profile.id}/`, formData);
      alert("✅ Profile updated successfully!");
      setProfile(formData);
      setEditMode(false);
    } catch (error) {
      alert("❌ Failed to update profile!");
      console.error(error);
    }
  };

  if (!profile) return <div className="loading">Loading your profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">👤 My Profile</h2>
        <p className="username">@{profile.user_name}</p>

        <div className="profile-section">
          <label>Email:</label>
          <p>{profile.email}</p>
        </div>

        <div className="profile-section">
          <label>Bio:</label>
          {editMode ? (
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
            />
          ) : (
            <p>{profile.bio || "No bio added yet."}</p>
          )}
        </div>

        <div className="profile-section">
          <label>Portfolio:</label>
          {editMode ? (
            <input
              type="text"
              name="portfolio"
              value={formData.portfolio || ""}
              onChange={handleChange}
            />
          ) : profile.portfolio ? (
            <a href={profile.portfolio} target="_blank" rel="noreferrer">
              {profile.portfolio}
            </a>
          ) : (
            <p>No portfolio link added.</p>
          )}
        </div>

        <div className="profile-section">
          <label>Hourly Rate:</label>
          {editMode ? (
            <select
              name="hourly_rate"
              value={formData.hourly_rate || ""}
              onChange={handleChange}
            >
              <option value="500">₹500/hr</option>
              <option value="1000">₹1000/hr</option>
              <option value="1500">₹1500/hr</option>
              <option value="2000">₹2000/hr</option>
            </select>
          ) : (
            <p>{profile.hourly_rate}</p>
          )}
        </div>

        <div className="profile-section">
          <label>Availability:</label>
          {editMode ? (
            <select
              name="availability"
              value={formData.availability || ""}
              onChange={handleChange}
            >
              <option value="available">Available</option>
              <option value="part_time">Part-time</option>
              <option value="busy">Busy</option>
            </select>
          ) : (
            <p>{profile.availability}</p>
          )}
        </div>

        <div className="skills-section">
          <h3>💡 Skills</h3>
          <div className="skills-list">
            {profile.skills.length > 0 ? (
              profile.skills.map((skill) => (
                <span key={skill.id} className="skill-tag">
                  {skill.name} — <em>{skill.level}</em>
                </span>
              ))
            ) : (
              <p>No skills added yet.</p>
            )}
          </div>
        </div>

        <div className="button-group">
          {editMode ? (
            <>
              <button className="save-btn" onClick={handleSave}>
                💾 Save
              </button>
              <button className="cancel-btn" onClick={() => setEditMode(false)}>
                ❌ Cancel
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
