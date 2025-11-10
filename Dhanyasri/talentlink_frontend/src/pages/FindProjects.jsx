import React, { useEffect, useState } from "react";
import styles from "../styles/FindProjects.module.css";
import NavigationBar from "./NavigationBar";
import API from "../api"; // ✅ Token handled automatically

function FindProjects() {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    budget: "",
    duration: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch projects with optional filters
  const fetchProjects = async (appliedFilters = filters) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (appliedFilters.search) params.append("search", appliedFilters.search);
      if (appliedFilters.category) params.append("category", appliedFilters.category);
      if (appliedFilters.budget) params.append("budget", appliedFilters.budget);
      if (appliedFilters.duration) params.append("duration", appliedFilters.duration);

      const queryString = params.toString() ? `?${params.toString()}` : "";

      console.log("🔍 Fetching:", `projects/${queryString}`);
      const res = await API.get(`projects/${queryString}`);
      setProjects(res.data);
    } catch (err) {
      console.error("❌ Error fetching projects:", err.response || err);
      if (err.response?.status === 401) {
        alert("⚠ Session expired. Please log in again.");
      } else {
        alert("⚠ Unable to fetch projects.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ Fetch all projects initially
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = (e) => {
    e.preventDefault();

    // ✅ Validation: Check if all fields are filled
    const { search, category, budget, duration } = filters;
    if (!search || !category || !budget || !duration) {
      alert("⚠ Please fill in all fields before applying filters.");
      return; // stop the function
    }

    fetchProjects(filters); // ✅ Trigger filtered fetch
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainSection}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <NavigationBar />
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          <h1>Find Projects</h1>

          {/* Filter Form */}
          <div className={styles.card}>
            <h2>Filter Projects</h2>
            <form onSubmit={handleFilter} className={styles.filterForm}>
              <input
                type="text"
                name="search"
                placeholder="Search by title or description"
                value={filters.search}
                onChange={handleChange}
              />
              <input
                type="text"
                name="category"
                placeholder="Filter by category"
                value={filters.category}
                onChange={handleChange}
              />
              <input
                type="number"
                name="budget"
                placeholder="Exact Budget"
                value={filters.budget}
                onChange={handleChange}
              />
              <input
                type="number"
                name="duration"
                placeholder="Exact Duration (days)"
                value={filters.duration}
                onChange={handleChange}
              />
              <button type="submit" disabled={loading}>
                {loading ? "Filtering..." : "Apply Filters"}
              </button>
            </form>
          </div>

          {/* Project Results */}
          <div className={styles.card}>
            <h2>Project Results</h2>
            {loading ? (
              <p>Loading projects...</p>
            ) : projects.length === 0 ? (
              <p>No projects found.</p>
            ) : (
              <div className={styles.projectGrid}>
                {projects.map((project) => (
                  <div key={project.id} className={styles.projectCard}>
                    <strong>{project.title}</strong>
                    <p>{project.description}</p>
                    <p>
                      <strong>Category:</strong> {project.category} |{" "}
                      <strong>Budget:</strong> ₹{project.budget} |{" "}
                      <strong>Duration:</strong> {project.duration} days
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindProjects;
