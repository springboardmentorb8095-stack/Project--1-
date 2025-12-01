import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function ProjectDetails({ projectId: propProjectId }) {
  const { id: urlProjectId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const projectId = propProjectId || urlProjectId;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState(null);
  const [proposalLoading, setProposalLoading] = useState(true);
  const [allProposals, setAllProposals] = useState([]);

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
      const res = await api.get(`/projects/${projectId}/`, {
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
        (p) => String(p.project) === String(projectId)
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
      const res = await api.get(`/projects/${projectId}/proposals/`, {
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
      await api.delete(`/projects/${projectId}/`, {
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
    if (projectId) {
      fetchProject();
      fetchUserProposal();
      fetchProposalsForClient();
    }
  }, [projectId]);

  const canEdit = isClient && String(project?.client) === String(userId);

  if (loading || proposalLoading)
    return <p className="text-gray-500 text-center mt-10">Loading project details...</p>;
  if (!project) return <p className="text-red-500 text-center mt-10">Project not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Project Title */}
      <h2 className="text-3xl font-bold text-gray-800">{project.title}</h2>

      {/* Project Details */}
      <div className="bg-white shadow rounded-lg p-6 space-y-5">
        <p>
          <span className="font-semibold text-blue-800 bg-blue-100 px-2 py-1 rounded-md shadow-sm">
 Description : 
</span>{" "}
          <span className="text-gray-600">{project.description}</span>
        </p>
        <p>
          
          <span className="font-semibold text-blue-800 bg-blue-100 px-2 py-1 rounded-md shadow-sm">
 Budget : 
</span>{" "}

          <span className="text-gray-600">
            ${project.budget ? Number(project.budget).toFixed(2) : "N/A"}
          </span>
        </p>
        <p>
           <span className="font-semibold text-blue-800 bg-blue-100 px-1 py-1 rounded-md shadow-sm">
 Required Skills:
</span>{" "}
          <span className="text-gray-600">
            {project.skills && project.skills.length > 0
              ? typeof project.skills[0] === "string"
                ? project.skills.join(", ")
                : project.skills.map((skill) => skill.name).join(", ")
              : "N/A"}
          </span>
        </p>
        <p>
           <span className="font-semibold text-blue-800 bg-blue-100 px-2 py-1 rounded-md shadow-sm">
 Duration:
</span>{" "}
          <span className="text-gray-600">{project.duration} days</span>
        </p>
        
        <p>
           <span className="font-semibold text-blue-800 bg-blue-100 px-2 py-1 rounded-md shadow-sm">
Status:
</span>{" "}
          <span className="font-semibold text-gray-700"></span>{" "}
          <span className="text-gray-600">{project.status}</span>
        </p>

        {/* Freelancer Actions */}
        {project.status === "open" && isFreelancer && (
          <button
            onClick={() =>
              navigate(proposal ? `/proposals/edit/${proposal.id}` : `/proposals/new/${project.id}`)
            }
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {proposal ? "Update Proposal" : "Send Proposal"}
          </button>
        )}

        {/* Client Actions */}
        {(canEdit && project.status == "open") && (
          <div className="mt-3 flex space-x-3">
            <button
              onClick={() => navigate(`/projects/edit/${project.id}`)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Edit Project
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Delete Project
            </button>
          </div>
        )}

        {/* Closed Project */}
        {project.status !== "open" && proposal && (
          <p className="mt-3 text-gray-700">
            <span className="font-semibold">Your Proposal Status:</span>{" "}
            {proposal.status === "rejected" ? "Not Selected" : proposal.status}
          </p>
        )}
        {project.status !== "open" && <h3 className="mt-2 text-xl font-semibold text-gray-800">Application Closed</h3>}
      </div>

      {/* Client Proposals */}
      {canEdit && (
        <div className="bg-blue shadow rounded-lg p-6 space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">Proposals Received</h3>
          {allProposals.length === 0 ? (
            <p className="text-gray-600">No proposals yet.</p>
          ) : (
            allProposals.map((p) => (
              <div key={p.id} className="border rounded-lg p-4 bg-gray-50 flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                <div className="space-y-1">
                  <p>
                    <span className="font-bold text-gray-700">Freelancer:</span>{" "}
                    <span className="text-gray-600">{p.freelancer_name || "Unknown"}</span>
                  </p>
                  <p>
                    <span className="font-bold text-gray-700">Budget:</span>{" "}
                    <span className="text-gray-600">${p.proposed_rate}</span>
                  </p>
                  <p>
                    <span className="font-bold text-gray-700">Status:</span>{" "}
                    <span className="text-gray-600">{p.status}</span>
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/proposals/view/${p.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mt-2 md:mt-0"
                >
                  View Proposal
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
