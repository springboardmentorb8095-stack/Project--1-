import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AsyncCreatableSelect from "react-select/async-creatable";

function Profile() {
  const [profile, setProfile] = useState({
    full_name: "",
    bio: "",
    skills: [], // array of { value, label }
    hourly_rate: "",
    availability: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("access");
useEffect(() => {
  const fetchProfile = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await api.get("profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const skillOptions = (res.data.skills || []).map((skill) => ({
        label: skill.name,
        value: skill.id,
      }));

      setProfile({
        full_name: res.data.full_name || "",
        bio: res.data.bio || "",
        skills: skillOptions,
        hourly_rate: res.data.hourly_rate || "",
        availability: res.data.availability || "",
        location: res.data.location || "",
      });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        setError("Failed to load profile.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [token]);


  // Async load existing skills matching input
  const loadSkillOptions = async (inputValue) => {
    try {
      const res = await api.get(`/skills/?search=${inputValue}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.map((skill) => ({
        label: skill.name,
        value: skill.id,
      }));
    } catch (err) {
      console.error("Error loading skills:", err);
      return [];
    }
  };

  // Create new skill and add to selected skills
  const handleCreateSkill = async (inputValue) => {
    try {
      const res = await api.post(
        "/skills/",
        { name: inputValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newSkill = { label: res.data.name, value: res.data.id };
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
    } catch (err) {
      console.error("Error creating skill:", err);
      alert("Could not create skill.");
    }
  };

  // Handle normal input changes (text, number)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle skill select changes
  const handleSkillChange = (selectedOptions) => {
    setProfile((prev) => ({
      ...prev,
      skills: selectedOptions || [],
    }));

    
  };

  // Save updated profile
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...profile,
        skill_ids: profile.skills.map((skill) => skill.value), // note key change here
        hourly_rate: profile.hourly_rate === "" ? null : profile.hourly_rate,
      };


      await api.patch("profile/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile updated successfully!");
      navigate("/");
    } catch (err) {
      setError("Failed to save profile.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Edit Profile</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Name:
          <br />
          <input
            type="text"
            name="full_name"
            value={profile.full_name}
            onChange={handleChange}
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Bio:
          <br />
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows={4}
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Skills:
          <br />
          <AsyncCreatableSelect
            isMulti
            value={profile.skills}
            onChange={handleSkillChange}
            onCreateOption={handleCreateSkill}
            loadOptions={loadSkillOptions}
            defaultOptions
            placeholder="Search or add skills..."
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Hourly Rate ($):
          <br />
          <input
            type="number"
            name="hourly_rate"
            value={profile.hourly_rate}
            onChange={handleChange}
            step="0.01"
            min="0"
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Availability:
          <br />
          <input
            type="text"
            name="availability"
            value={profile.availability}
            onChange={handleChange}
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Location:
          <br />
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
          />
        </label>
      </div>

      <button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Profile"}
      </button>

      <button
        style={{ marginLeft: "1rem" }}
        onClick={() => navigate("/")}
        disabled={saving}
      >
        Cancel / Back to Dashboard
      </button>
    </div>
  );
}

export default Profile;
