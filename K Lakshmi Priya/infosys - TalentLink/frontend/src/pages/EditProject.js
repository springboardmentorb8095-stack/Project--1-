// src/pages/EditProject.js
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function EditProject() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`projects/${id}/`);
        setProject(res.data);
      } catch (err) {
        console.error("Error loading project:", err);
      }
    };
    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(`projects/${id}/`, project);
      alert("Project updated successfully!");
      navigate("/my-projects");
    } catch (err) {
      console.error("Error updating project:", err);
      alert("Failed to update project");
    }
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Edit Project</h2>
      <form onSubmit={handleSave}>
        <input name="title" value={project.title} onChange={handleChange} style={{ width: "100%", marginBottom: "1rem" }} />
        <textarea name="description" value={project.description} onChange={handleChange} rows={4} style={{ width: "100%", marginBottom: "1rem" }} />
        <input name="skills_required" value={project.skills_required} onChange={handleChange} style={{ width: "100%", marginBottom: "1rem" }} />
        <input name="budget" type="number" value={project.budget} onChange={handleChange} style={{ width: "100%", marginBottom: "1rem" }} />
        <input name="duration" value={project.duration} onChange={handleChange} style={{ width: "100%", marginBottom: "1rem" }} />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProject;
