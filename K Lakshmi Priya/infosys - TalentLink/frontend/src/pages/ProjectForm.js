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
    skills: [], // [{ label, value }]
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch project data if editing
  useEffect(() => {
  if (isEdit) {
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
  }
}, [id, isEdit, token]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillChange = (selectedOptions) => {
    setForm((prev) => ({
      ...prev,
      skills: selectedOptions || [],
    }));
  };

  const handleCreateSkill = async (inputValue) => {
    try {
      const res = await api.post(
        "/skills/",
        { name: inputValue },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newSkill = { label: res.data.name, value: res.data.id };
      setForm((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
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

      return res.data.map((skill) => ({
        label: skill.name,
        value: skill.id,
      }));
    } catch (err) {
      console.error("Error loading skills:", err);
      return [];
    }
  };
const handleSubmit = async () => {
  setSaving(true);
  setError(null);

  // Map selected skills to their IDs for backend
  const skillIds = form.skills.map((s) => s.value);

  const payload = {
    title: form.title,
    description: form.description,
    budget: form.budget,
    duration: form.duration,
    skill_ids: skillIds, // send skill IDs here
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

// When loading for edit, map backend skills to {label, value} with id and name

useEffect(() => {
  if (isEdit) {
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
  }
}, [id, isEdit, token]);




  

  if (loading) return <p>Loading project...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{isEdit ? "Edit Project" : "Create New Project"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Title:
          <br />
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" , width:"80%"}}>
        <label>
          Description:
          <br />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Budget:
          <br />
          <input
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Duration:
          <br />
          <input
            type="text"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Skills:
          <br />
          <AsyncCreatableSelect
            isMulti
            value={form.skills}
            onChange={handleSkillChange}
            onCreateOption={handleCreateSkill}
            loadOptions={loadSkillOptions}
            defaultOptions
            placeholder="Search or add skills..."
          />
        </label>
      </div>

      <button onClick={handleSubmit} disabled={saving}>
        {saving ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
      </button>

      <button
        style={{ marginLeft: "1rem" }}
        onClick={() => navigate(`/projects/${id}`)}
        disabled={saving}
      >
        Cancel
      </button>
    </div>
  );
}

export default ProjectForm;
