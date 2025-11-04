import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaUserCircle } from "react-icons/fa";
function ProjectList({ setPanel }) {
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
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
      setUserId(parsedUser?.id);
      setIsClient(parsedUser?.role === "client");
      setIsFreelancer(parsedUser?.role === "freelancer");
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

  const filteredProjects = (() => {
    if (isClient && showMyProjectsOnly) {
      return projects.filter((p) => String(p.client) === String(userId));
    }
    if (isFreelancer && showAppliedProjectsOnly) {
      const appliedIds = new Set(proposals.map((proposal) => proposal.project));
      return projects.filter((p) => appliedIds.has(p.id));
    }
    return projects;
  })();

  // ✅ Updated navigation: opens right panel if not logged in
  const handleProtectedNavigate = (path, panel = null) => {
    if (!token) {
      if (setPanel) setPanel("login"); // open login panel instead of navigating
      return;
    }

    if (panel && (isClient || isFreelancer)) {
      navigate(`/projects/new`);
      return;
    }

    navigate(path);
  };

  if (loading) return <p className="text-center py-10">Loading projects...</p>;

  return (
    <div className="bg-gray-50 px-6 py-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Explore Projects</h2>
      

      {!token && (
        <p className="text-gray-500 mb-6 text-center">
          Please log in to apply for or post projects.
        </p>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        {isClient && (
          <>
            <button
              onClick={() =>
                handleProtectedNavigate("/projects/new", "/projects")
              }
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              + Post New Project
            </button>
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={showMyProjectsOnly}
                onChange={() => setShowMyProjectsOnly((prev) => !prev)}
                className="rounded border-gray-300 focus:ring-blue-500"
              />
              Show only my projects
            </label>
          </>
        )}

        {isFreelancer && (
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={showAppliedProjectsOnly}
              onChange={() => setShowAppliedProjectsOnly((prev) => !prev)}
              className="rounded border-gray-300 focus:ring-blue-500"
            />
            Show only projects I've applied for
          </label>
        )}

        {/* Search */}
        <div className="flex flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by skill, title, budget..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No projects available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="border border-gray-200 rounded-xl p-5 shadow hover:shadow-lg transition bg-white"
            >
              <div
                onClick={() =>
                  handleProtectedNavigate(
                    String(p.client) === String(userId)
                      ? "/profile"
                      : `/users/${p.client}/profile`
                  )
                }
                className="flex items-center gap-3 text-gray-800 font-medium cursor-pointer mb-3"
              >
                <FaUserCircle size={28} />
                <span>{p.client_name}</span>
              </div>

              <h3
                onClick={() => handleProtectedNavigate(`/projects/${p.id}`)}
                className={`text-xl font-semibold mb-2 cursor-pointer ${
                  p.status !== "open"
                    ? "text-gray-400"
                    : "text-blue-600 hover:underline"
                }`}
              >
                {p.title}
              </h3>

              <p className="mb-2 text-gray-700">{p.description}</p>
              <p className="text-sm text-gray-500 mb-3">
                <strong>Budget:</strong> ${p.budget} | <strong>Duration:</strong>{" "}
                {p.duration} days
              </p>

              {isClient && String(p.client) === String(userId) && (
                <p className="text-green-600 mb-3 font-medium">(Posted by you)</p>
              )}

              <button
                onClick={() => handleProtectedNavigate(`/projects/${p.id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectList;
