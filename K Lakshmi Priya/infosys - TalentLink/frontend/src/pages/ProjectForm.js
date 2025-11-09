import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AsyncCreatableSelect from "react-select/async-creatable";
import api from "../api/axios";

function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const token = localStorage.getItem("access");

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    duration: "",
    skills: [],
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;

    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const skillOptions = (res.data.skills || []).map((skill) => ({
          label: skill.name,
          value: skill.id,
        }));

        setForm({
          title: res.data.title || "",
          description: res.data.description || "",
          budget: res.data.budget || "",
          duration: res.data.duration || "",
          skills: skillOptions,
        });
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, isEdit, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (selectedOptions) => {
    setForm((prev) => ({ ...prev, skills: selectedOptions || [] }));
  };

  const handleCreateSkill = async (inputValue) => {
    try {
      const res = await api.post(
        "/skills/",
        { name: inputValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newSkill = { label: res.data.name, value: res.data.id };
      setForm((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
    } catch (err) {
      console.error("Error creating skill:", err);
      alert("Could not create skill.");
    }
  };

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

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.budget || !form.duration) {
      setError("Please fill all required fields.");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      description: form.description,
      budget: form.budget,
      duration: form.duration,
      skill_ids: form.skills.map((s) => s.value),
    };

    try {
      if (isEdit) {
        await api.put(`/projects/${id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Project updated successfully!");
      } else {
        await api.post("/projects/", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Project created successfully!");
      }

      navigate("/projects");
    } catch (err) {
      console.error("Error saving project:", err.response?.data || err);
      setError("Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-gray-500 text-center mt-6">Loading project...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEdit ? "Edit Project" : "Create New Project"}
      </h2>

      {error && (
        <p className="text-red-600 mb-4 font-medium border border-red-200 bg-red-50 p-3 rounded">
          {error}
        </p>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Budget</label>
        <input
          type="number"
          name="budget"
          value={form.budget}
          onChange={handleChange}
          step="0.01"
          min="0"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Duration</label>
        <input
          type="text"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Skills</label>
        <AsyncCreatableSelect
          isMulti
          value={form.skills}
          onChange={handleSkillChange}
          onCreateOption={handleCreateSkill}
          loadOptions={loadSkillOptions}
          defaultOptions
          placeholder="Search or add skills..."
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      <div className="flex items-center">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`px-6 py-2 rounded-md text-white font-medium transition ${
            saving
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {saving ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
        </button>

        <button
          onClick={() => navigate(isEdit ? `/projects/${id}` : "/projects")}
          disabled={saving}
          className="ml-4 px-6 py-2 rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ProjectForm;
