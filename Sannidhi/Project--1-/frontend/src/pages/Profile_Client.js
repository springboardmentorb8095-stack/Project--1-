import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Profile_Client() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    contact: "",
    businessName: "",
    bio: "",
  });

  // ✅ Auto-fill email from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.email) {
      setProfile((prev) => ({ ...prev, email: storedUser.email }));
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");
    if (!token) {
      alert("❌ Please login first!");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/client/profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contact: profile.contact,
          business_name: profile.businessName,
          bio: profile.bio,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Saved to backend:", data);
        alert("✅ Client Profile Saved Successfully!");
        
        // 👇 Redirect to Login Page
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("❌ Error saving profile:", errorData);
        alert("❌ Failed to save profile: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("❌ Something went wrong while saving profile!");
    }
  };

  return (
    <div className="auth-container">
      <h2>👨‍💼 Client Profile</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={profile.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={profile.email}
          disabled
        />

        <input
          type="text"
          name="contact"
          placeholder="Contact No."
          value={profile.contact}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="businessName"
          placeholder="Business Name"
          value={profile.businessName}
          onChange={handleChange}
          required
        />

        <textarea
          name="bio"
          placeholder="Write a short bio..."
          value={profile.bio}
          onChange={handleChange}
          required
        />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default Profile_Client;
