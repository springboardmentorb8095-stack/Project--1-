import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function MyProfile() {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserData(storedUser);
      setPreview(storedUser.profilePhoto || null);
    }
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setPreview(imageURL);
      setUserData((prev) => ({ ...prev, profilePhoto: imageURL }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(userData));
    setEditMode(false);
    alert("✅ Profile updated successfully!");

    // 🚀 Role-based redirect logic
    const role = (userData.role || "").toLowerCase();
    if (role === "client") {
      navigate("/client-dashboard");
    } else if (role === "freelancer") {
      navigate("/freelancer-dashboard");
    } else {
      navigate("/dashboard"); // default fallback
    }
  };

  if (!userData) {
    return (
      <div className="auth-container">
        <h2>⚠️ No Profile Found</h2>
        <p>Please register or update your profile first.</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>👤 My Profile</h2>

      <div className="auth-form">
        {/* Profile Photo */}
        <div style={{ marginBottom: "15px" }}>
          <img
            src={preview || "https://via.placeholder.com/120"}
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #555",
            }}
          />
          {editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: "block", marginTop: "10px" }}
            />
          )}
        </div>

        {/* Name */}
        <div className="form-group">
          <label><strong>Name:</strong></label>
          {editMode ? (
            <input
              type="text"
              name="username"
              value={userData.username || ""}
              onChange={handleChange}
            />
          ) : (
            <p>{userData.username || "N/A"}</p>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label><strong>Email:</strong></label>
          {editMode ? (
            <input
              type="email"
              name="email"
              value={userData.email || ""}
              onChange={handleChange}
            />
          ) : (
            <p>{userData.email || "N/A"}</p>
          )}
        </div>

        {/* Role */}
        <div className="form-group">
          <label><strong>Role:</strong></label>
          <p>{userData.role || "N/A"}</p>
        </div>

        {/* Buttons */}
        {editMode ? (
          <button onClick={handleSave} className="auth-button">
            💾 Save
          </button>
        ) : (
          <button onClick={() => setEditMode(true)} className="auth-button">
            ✏️ Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default MyProfile;
