import React, { useState, useEffect } from "react";
import API from "../api";
import NavigationBar from "./NavigationBar";
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // ✅ Fetch freelancer profile
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
      setPreview(res.data.profile_image ? res.data.profile_image : null);
    } catch (err) {
      console.error("Error fetching freelancer profile:", err);
      alert("❌ Failed to fetch profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Handle text/checkbox input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Handle image change + live preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Submit profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = new FormData();
      updatedData.append("portfolio", formData.portfolio);
      updatedData.append("skills", formData.skills);
      updatedData.append("hourly_rate", formData.hourly_rate);
      updatedData.append("availability", formData.availability);
      if (selectedImage) updatedData.append("profile_image", selectedImage);

      const res = await API.patch("freelancer-profile/", updatedData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Refresh profile instantly after successful update
      setProfile(res.data);
      setPreview(res.data.profile_image || preview);
      setEditMode(false);
      alert("✅ Profile updated successfully!");
      fetchProfile(); // Refresh with new image URL
    } catch (err) {
      console.error("Error updating freelancer profile:", err);
      alert("❌ Failed to update profile.");
    }
  };

  if (!profile) return <p className={styles.loading}>Loading profile...</p>;

  return (
    <div className={styles.pageWrapper}>
      <NavigationBar />

      <div className={styles.container}>
        <h1>Freelancer Profile</h1>

        {!editMode ? (
          <div className={styles.card}>
            {/* ✅ Profile Image Display */}
            <div className={styles.profileImageSection}>
              <img
                src={preview || "/default-avatar.png"}
                alt="Profile"
                className={styles.profileImage}
              />
            </div>

            <p><strong>Portfolio:</strong> {profile.portfolio || "Not provided"}</p>
            <p><strong>Skills:</strong> {profile.skills || "Not provided"}</p>
            <p><strong>Hourly Rate:</strong> ${profile.hourly_rate || "0"}/hr</p>
            <p><strong>Availability:</strong> {profile.availability ? "Available" : "Not Available"}</p>

            <button className={styles.toggleBtn} onClick={() => setEditMode(true)}>
              ✏️ Edit Profile
            </button>
          </div>
        ) : (
          <form className={styles.card} onSubmit={handleSubmit}>
            {/* ✅ Profile Image Upload */}
            <div className={styles.profileImageUpload}>
              <label>Profile Photo</label>
              {preview && <img src={preview} alt="Preview" className={styles.profileImage} />}
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>

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

export default FreelancerProfile;
