import React, { useState, useEffect } from "react";
import "./Auth.css";

function Profile_Freelancer() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    contact: "",
    skills: "",
    hourlyRate: "",
    available: "",
  });

  // ✅ Auto-fill email from localStorage after register
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.email) {
      setProfile((prev) => ({ ...prev, email: storedUser.email }));
    }
  }, []);

  // ✅ Update input values
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // ✅ Save profile (future: can send to backend)
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("💾 Freelancer Profile Saved:", profile);
    alert("✅ Freelancer Profile Saved Successfully!");

    // Example future backend call:
    /*
    fetch("http://localhost:8000/api/freelancer/profile/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    */
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
          name="hourlyRate"
          placeholder="Hourly Rate ($)"
          value={profile.hourlyRate}
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
