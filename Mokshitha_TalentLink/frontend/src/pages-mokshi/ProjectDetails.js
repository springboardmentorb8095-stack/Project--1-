import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Feed.css";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
    fetchProposals();
  }, []);

  const fetchProject = async () => {
    const res = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/`);
    setProject(res.data);
  };

  const fetchProposals = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/proposals/");
    setProposals(res.data.filter((p) => p.project === parseInt(id)));
  };

  return (
    <div className="details-container">
      {project ? (
        <>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <p><b>💰 Budget:</b> ₹{project.budget}</p>
          <p><b>⏳ Duration:</b> {project.duration}</p>
          <p><b>🧠 Skills Required:</b> {project.skills_required?.length ? project.skills_required.map(s => s.name).join(", ") : "None"}</p>

          <button onClick={() => navigate(`/project/${id}/propose`)}>💬 Submit Proposal</button>

          <h3>Existing Proposals:</h3>
          {proposals.length > 0 ? (
            proposals.map((p) => (
              <div key={p.id} className="proposal-card">
                <p><b>Freelancer:</b> {p.freelancer_name}</p>
                <p><b>Message:</b> {p.description}</p>
                <p><b>Price:</b> ₹{p.price}</p>
                <p><b>Status:</b> {p.status}</p>
              </div>
            ))
          ) : (
            <p>No proposals yet.</p>
          )}
        </>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
}
