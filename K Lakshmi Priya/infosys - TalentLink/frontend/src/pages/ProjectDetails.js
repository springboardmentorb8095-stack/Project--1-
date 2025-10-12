import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState(null);
  const [proposalLoading, setProposalLoading] = useState(true);
  const [allProposals, setAllProposals] = useState([]); // 👈 for client

  let user = null;
  let userId = null;
  let isClient = false;
  let isFreelancer = false;

  try {
    const userStr = localStorage.getItem("user");
    user = userStr ? JSON.parse(userStr) : null;
    userId = user?.id;
    isClient = user?.role === "client";
    isFreelancer = user?.role === "freelancer";
  } catch (e) {
    console.error("Error parsing user from localStorage", e);
  }

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(res.data);
    } catch (err) {
      console.error("Failed to fetch project details", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProposal = async () => {
    if (!isFreelancer) {
      setProposalLoading(false);
      return;
    }
    try {
      const res = await api.get(`/proposals/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userProposal = res.data.find(
        (p) => String(p.project) === String(id)
      );
      setProposal(userProposal || null);
    } catch (err) {
      console.error("Failed to fetch user proposal", err);
    } finally {
      setProposalLoading(false);
    }
  };

  const fetchProposalsForClient = async () => {
    if (!isClient) return;

    try {
      const res = await api.get(`/projects/${id}/proposals/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllProposals(res.data || []);
    } catch (err) {
      console.error("Failed to fetch proposals for client", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Project deleted successfully!");
      navigate("/projects");
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };

  useEffect(() => {
    fetchProject();
    fetchUserProposal();
    fetchProposalsForClient();
  }, [id]);

  const canEdit = isClient && String(project?.client) === String(userId);

  if (loading || proposalLoading) return <p>Loading project details...</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <p>
        <strong>Budget:</strong> ${project.budget}
      </p>
      <p>
        <strong>Skills:</strong>{" "}
        {project.skills && project.skills.length > 0
          ? typeof project.skills[0] === "string"
            ? project.skills.join(", ")
            : project.skills.map((skill) => skill.name).join(", ")
          : "N/A"}
      </p>
      <p>
        <strong>Duration:</strong> {project.duration} days
      </p>

      {isFreelancer && (
        <button
          onClick={() =>
            navigate(proposal ? `/proposals/edit/${proposal.id}` : `/proposals/new/${id}`)
          }
          style={{ marginTop: "1rem" }}
        >
          {proposal ? "Update Proposal" : "Send Proposal"}
        </button>
      )}

      {canEdit && (
        <div style={{ marginTop: "1rem" }}>
          <button onClick={() => navigate(`/projects/edit/${project.id}`)}>
            Edit Project
          </button>
          <button
            onClick={handleDelete}
            style={{ marginLeft: "1rem", color: "red" }}
          >
            Delete Project
          </button>
        </div>
      )}

      {/* 💬 Client Proposal List */}
      {canEdit && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Proposals Received</h3>
          {allProposals.length === 0 ? (
            <p>No proposals yet.</p>
          ) : (
            allProposals.map((p) => (
              <div key={p.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
                <p><strong>Freelancer:</strong> {p.freelancer_name || "Unknown"}</p>
                <p><strong>Budget:</strong> ${p.proposed_rate}</p>
                <p><strong>Status:</strong> {p.status}</p>
                <button onClick={() => navigate(`/proposals/view/${p.id}`)}>View Proposal</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
