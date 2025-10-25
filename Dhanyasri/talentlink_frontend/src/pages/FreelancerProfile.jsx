import React, { useState, useEffect } from "react";
import API from "../api";
import NavigationBar from "./NavigationBar"; // freelancer-specific nav should be handled inside
import styles from "../styles/FreelancerProfile.module.css";

function FreelancerProfile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    portfolio: "",
    skills: "",
    hourly_rate: "",
    availability: true,
  });
  const [editMode, setEditMode] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await API.get("freelancer-profile/");
      setProfile(res.data);
      setFormData({
        portfolio: res.data.portfolio || "",
        skills: res.data.skills || "",
        hourly_rate: res.data.hourly_rate || "",
        availability: res.data.availability,
      });
    } catch (err) {
      console.error("Error fetching freelancer profile:", err);
      alert("❌ Failed to fetch profile. Check console for details.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { portfolio, skills, hourly_rate, availability } = formData;
      const res = await API.patch("freelancer-profile/", {
        portfolio,
        skills,
        hourly_rate,
        availability,
      });
      setProfile(res.data);
      setEditMode(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating freelancer profile:", err);
      alert("❌ Failed to update profile. Check console.");
    }
  };

  if (!profile) return <p className={styles.loading}>Loading profile...</p>;

  return (
    <div className={styles.pageWrapper}>
      {/* Sidebar Navigation */}
      <NavigationBar />

      {/* Main Content */}
      <div className={styles.container}>
        <h1>Freelancer Profile</h1>

        {!editMode ? (
          <div className={styles.card}>
            <p><strong>Portfolio:</strong> {profile.portfolio || "Not provided"}</p>
            <p><strong>Skills:</strong> {profile.skills || "Not provided"}</p>
            <p><strong>Hourly Rate:</strong> ${profile.hourly_rate || "0"}/hr</p>
            <p><strong>Availability:</strong> {profile.availability ? "Available" : "Not Available"}</p>
            <button className={styles.toggleBtn} onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </div>
        ) : (
          <form className={styles.card} onSubmit={handleSubmit}>
            <label>Portfolio</label>
            <textarea
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
            />

            <label>Skills</label>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
            />

            <label>Hourly Rate ($/hr)</label>
            <input
              type="number"
              name="hourly_rate"
              value={formData.hourly_rate}
              onChange={handleChange}
              required
            />

            <label>
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={handleChange}
              />
              Available
            </label>

            <button type="submit">Save Changes</button>
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default FreelancerProfile;
