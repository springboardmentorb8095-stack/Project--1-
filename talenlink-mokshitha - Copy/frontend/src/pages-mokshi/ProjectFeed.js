import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Feed.css";

export default function ProjectFeed() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/projects/");
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  return (
    <div className="feed-container">
      <h1>📰 Project Feed</h1>
      <p>Explore all available projects posted by clients!</p>

      <div className="feed-grid">
        {projects.map((proj) => (
          <div key={proj.id} className="feed-card">
            <h3>{proj.title}</h3>
            <p>{proj.description.substring(0, 100)}...</p>
            <p><b>💰 Budget:</b> ₹{proj.budget}</p>
            <p><b>⏳ Duration:</b> {proj.duration}</p>
            <button onClick={() => navigate(`/project/${proj.id}`)}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
