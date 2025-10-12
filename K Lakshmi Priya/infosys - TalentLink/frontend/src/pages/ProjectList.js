import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function ProjectList() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMyProjectsOnly, setShowMyProjectsOnly] = useState(false);
  const [showAppliedProjectsOnly, setShowAppliedProjectsOnly] = useState(false);

  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isFreelancer, setIsFreelancer] = useState(false);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
        setUserId(parsedUser?.id);
        setIsClient(parsedUser?.role === "client");
        setIsFreelancer(parsedUser?.role === "freelancer");
      }
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects/", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProposals = async () => {
    if (!isFreelancer || !token || !userId) return;

    try {
      const res = await api.get(`/proposals/?freelancer=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProposals(res.data);
    } catch (err) {
      console.error("Failed to fetch proposals:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchProposals();
  }, [token, isFreelancer, userId]);

  const handleSearch = async () => {
    try {
      const res = await api.get(`/projects/?search=${searchTerm}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setProjects(res.data);
      setShowMyProjectsOnly(false);
      setShowAppliedProjectsOnly(false);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Project deleted successfully!");
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };

  const filteredProjects = (() => {
    if (isClient && showMyProjectsOnly) {
      return projects.filter((p) => String(p.client) === String(userId));
    }
    if (isFreelancer && showAppliedProjectsOnly) {
      const appliedProjectIds = new Set(proposals.map((proposal) => proposal.project));
      return projects.filter((p) => appliedProjectIds.has(p.id));
    }
    return projects;
  })();

  if (loading) return <p>Loading projects...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Available Projects</h2>

      {!token && (
        <p style={{ color: "gray" }}>
          Log in to apply for or post projects.
        </p>
      )}

      {isClient && (
        <>
          <button onClick={() => navigate("/projects/new")}>
            + Post New Project
          </button>

          <div style={{ margin: "1rem 0" }}>
            <label>
              <input
                type="checkbox"
                checked={showMyProjectsOnly}
                onChange={() => setShowMyProjectsOnly((prev) => !prev)}
              />{" "}
              Show only my projects
            </label>
          </div>
        </>
      )}

      {isFreelancer && (
        <div style={{ margin: "1rem 0" }}>
          <label>
            <input
              type="checkbox"
              checked={showAppliedProjectsOnly}
              onChange={() => setShowAppliedProjectsOnly((prev) => !prev)}
            />{" "}
            Show only projects I've applied for
          </label>
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by skill, title, budget..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", width: "250px" }}
        />
        <button onClick={handleSearch} style={{ marginLeft: "10px" }}>
          Search
        </button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        {filteredProjects.length === 0 ? (
          <p>No projects available.</p>
        ) : (
          filteredProjects.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => navigate(`/projects/${p.id}`)}
              >
                {p.title}
              </h3>
              <p>{p.description}</p>
              <p>
                <strong>Budget:</strong> ${p.budget} |{" "}
                <strong>Duration:</strong> {p.duration} days
              </p>

              {isClient && String(p.client) === String(userId) && (
                <p style={{ color: "green" }}>(Posted by you)</p>
              )}

              <button onClick={() => navigate(`/projects/${p.id}`)}>
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProjectList;
