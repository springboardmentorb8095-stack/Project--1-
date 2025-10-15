// src/pages/Profile_Freelancer.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./Auth.css";

function Profile_Freelancer() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    contact: "",
    skills: "",
    hourly_rate: "",
    available: "",
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
      const response = await api.post("freelancer/profile/", {
        contact: profile.contact,
        skills: profile.skills,
        hourly_rate: profile.hourly_rate,
        available: profile.available,
      });

      console.log("✅ Saved to backend:", response.data);
      alert("✅ Freelancer Profile Saved Successfully!");
      
      // 👇 Redirect to Login Page
      navigate("/login");
    } catch (error) {
      console.error("❌ Failed to save profile:", error.response?.data);
      alert("❌ Failed to save profile: " + JSON.stringify(error.response?.data));
    }
  };

  return (
    <div className="auth-container">
      <h2>💻 Freelancer Profile</h2>
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
          name="skills"
          placeholder="Skills (e.g. React, Django)"
          value={profile.skills}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="hourly_rate"
          placeholder="Hourly Rate ($)"
          value={profile.hourly_rate}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="available"
          placeholder="Availability (hrs/day)"
          value={profile.available}
          onChange={handleChange}
          required
        />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default Profile_Freelancer;
