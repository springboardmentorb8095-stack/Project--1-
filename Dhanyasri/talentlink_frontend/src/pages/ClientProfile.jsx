import React, { useState, useEffect } from "react";
import API from "../api";
import NavigationBar from "./NavigationBar";
import styles from "../styles/ClientProfile.module.css";

function ClientProfile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    company_name: "",
    bio: "",
    contact_email: "",
  });
  const [editMode, setEditMode] = useState(false);

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await API.get("client-profile/");
      setProfile(res.data);
      setFormData({
        company_name: res.data.company_name || "",
        bio: res.data.bio || "",
        contact_email: res.data.contact_email || "",
      });
    } catch (err) {
      console.error("Error fetching client profile:", err);
      alert("❌ Failed to fetch profile. Check console for details.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.patch("client-profile/", formData);
      setProfile(res.data);
      setEditMode(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating client profile:", err);
      alert("❌ Failed to update profile. Check console.");
    }
  };

  if (!profile) return <p className={styles.loading}>Loading profile...</p>;

  return (
    <div className={styles.pageWrapper}>
      <NavigationBar />

      <div className={styles.container}>
        <h1>Client Profile</h1>

        {!editMode ? (
          <div className={styles.card}>
            <p><strong>Company Name:</strong> {profile.company_name}</p>
            <p><strong>Bio:</strong> {profile.bio || "Not provided"}</p>
            <p><strong>Contact Email:</strong> {profile.contact_email}</p>

            <button className={styles.toggleBtn} onClick={() => setEditMode(true)}>
              ✏️ Edit Profile
            </button>
          </div>
        ) : (
          <form className={styles.card} onSubmit={handleSubmit}>
            <label>Company Name</label>
            <input
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
            />

            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />

            <label>Contact Email</label>
            <input
              name="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={handleChange}
              required
            />

            <button type="submit">💾 Save Changes</button>
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setEditMode(false)}
            >
              ❌ Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ClientProfile;
