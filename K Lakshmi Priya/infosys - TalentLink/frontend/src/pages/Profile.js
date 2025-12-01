import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AsyncCreatableSelect from "react-select/async-creatable";
import Portfolio from "./Portfolio";

function Profile() {
  const [profile, setProfile] = useState({
    full_name: "",
    bio: "",
    skills: [],
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
  }, [token, navigate]);

  const loadSkillOptions = async (inputValue) => {
    try {
      const res = await api.get(`/skills/?search=${inputValue}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.map((skill) => ({ label: skill.name, value: skill.id }));
    } catch (err) {
      console.error("Error loading skills:", err);
      return [];
    }
  };

  const handleCreateSkill = async (inputValue) => {
    try {
      const res = await api.post(
        "/skills/",
        { name: inputValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newSkill = { label: res.data.name, value: res.data.id };
      setProfile((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
    } catch (err) {
      console.error("Error creating skill:", err);
      alert("Could not create skill.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (selectedOptions) => {
    setProfile((prev) => ({ ...prev, skills: selectedOptions || [] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...profile,
        skill_ids: profile.skills.map((skill) => skill.value),
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

  if (loading) return <p className="text-gray-500 text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-indigo-600">Edit Profile</h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Name:</label>
            <input
              type="text"
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Bio:</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Skills:</label>
            <AsyncCreatableSelect
              isMulti
              value={profile.skills}
              onChange={handleSkillChange}
              onCreateOption={handleCreateSkill}
              loadOptions={loadSkillOptions}
              defaultOptions
              placeholder="Search or add skills..."
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Hourly Rate ($):</label>
            <input
              type="number"
              name="hourly_rate"
              value={profile.hourly_rate}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Availability:</label>
            <input
              type="text"
              name="availability"
              value={profile.availability}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Location:</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-3 rounded-full font-semibold transition ${
              saving ? "bg-gray-400 text-gray-700" : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

          <button
            onClick={() => navigate("/")}
            disabled={saving}
            className="px-6 py-3 rounded-full font-semibold border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel / Back to Dashboard
          </button>
        </div>
      </div>

      <div>
        <Portfolio />
      </div>
    </div>
  );
}

export default Profile;
