import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./PostProject.css";

const API_ROOT = process.env.REACT_APP_API_ROOT || "http://127.0.0.1:8080";


const PostProject = ({ user }) => {
  const [formData, setFormData] = useState({
    title: "",
    budget: "",
    skills: "",
    deadline: "",
    description: "",
  });

  const [skillsList, setSkillsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Add skill when pressing Enter or comma
  const handleSkillInput = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const skill = formData.skills.trim();
      if (skill && !skillsList.includes(skill)) {
        setSkillsList([...skillsList, skill]);
        setFormData({ ...formData, skills: "" });
      }
    }
  };

  // ✅ Remove skill tag
  const removeSkill = (skill) => {
    setSkillsList(skillsList.filter((s) => s !== skill));
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Submit project
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...formData,
        skills: skillsList,
        client: user?.id || 1, // Replace with logged-in user's ID
      };

      // ✅ Updated axios POST request with JWT token
      const token = localStorage.getItem("access_token"); // if using JWT

      const res = await axios.post(
        `${API_ROOT}/api/projects/create/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("✅ Project Created:", res.data);
      setMessage("🎉 Project posted successfully!");

      // Reset form after successful post
      setFormData({
        title: "",
        budget: "",
        skills: "",
        deadline: "",
        description: "",
      });
      setSkillsList([]);

      // Optional: auto-refresh dashboard or navigate
      window.dispatchEvent(new Event("project-updated"));
    } catch (error) {
      console.error("❌ Error posting project:", error);
      if (error.response) {
        console.log("Server response:", error.response.data);
      }
      setMessage("❌ Something went wrong while posting your project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="post-container"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="post-header">
        <h2>Create Your Project</h2>
        <p>Post your project and connect with top freelancers 🚀</p>
      </div>

      <motion.div
        className="post-card"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <form className="project-form" onSubmit={handleSubmit}>
          {/* Project Title */}
          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Build a React Dashboard"
              required
            />
          </div>

          {/* Budget & Deadline */}
          <div className="form-row">
            <div className="form-group">
              <label>Budget (₹)</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g., 5000"
                min="100"
                required
              />
            </div>

            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Skills */}
          <div className="form-group">
            <label>Required Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              onKeyDown={handleSkillInput}
              placeholder="e.g., React, Django, Figma"
            />
            <div className="skills-container">
              {skillsList.map((skill, index) => (
                <motion.span
                  key={index}
                  className="skill-tag"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => removeSkill(skill)}
                >
                  {skill} ✕
                </motion.span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Project Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write about your project goals, deliverables, and expectations..."
              maxLength={500}
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "⏳ Posting..." : "🚀 Post Project"}
          </motion.button>

          {message && <p className="status-msg">{message}</p>}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PostProject;
