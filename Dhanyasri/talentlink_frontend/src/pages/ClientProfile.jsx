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
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // ✅ Fetch profile data
  const fetchProfile = async () => {
    try {
      const res = await API.get("client-profile/");
      setProfile(res.data);
      setFormData({
        company_name: res.data.company_name || "",
        bio: res.data.bio || "",
        contact_email: res.data.contact_email || "",
      });
      setPreview(res.data.profile_image ? res.data.profile_image : null);
    } catch (err) {
      console.error("Error fetching client profile:", err);
      alert("❌ Failed to fetch profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle image upload + preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file)); // temporary preview before upload
    }
  };

  // ✅ Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = new FormData();
      updatedData.append("company_name", formData.company_name);
      updatedData.append("bio", formData.bio);
      updatedData.append("contact_email", formData.contact_email);
      if (selectedImage) updatedData.append("profile_image", selectedImage);

      const res = await API.patch("client-profile/", updatedData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile(res.data);
      setPreview(res.data.profile_image || preview); // ✅ keep uploaded image visible
      setSelectedImage(null);
      setEditMode(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating client profile:", err);
      alert("❌ Failed to update profile.");
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
            <div className={styles.profileImageSection}>
              <img
                src={preview || "/default-avatar.png"}
                alt="Profile"
                className={styles.profileImage}
              />
            </div>

            <p><strong>Company Name:</strong> {profile.company_name}</p>
            <p><strong>Bio:</strong> {profile.bio || "Not provided"}</p>
            <p><strong>Contact Email:</strong> {profile.contact_email}</p>

            <button
              className={styles.toggleBtn}
              onClick={() => setEditMode(true)}
            >
              ✏️ Edit Profile
            </button>
          </div>
        ) : (
          <form className={styles.card} onSubmit={handleSubmit}>
            <div className={styles.profileImageUpload}>
              <label>Profile Photo</label>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className={styles.profileImage}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

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
