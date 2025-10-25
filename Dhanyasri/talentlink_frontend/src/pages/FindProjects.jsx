import React, { useEffect, useState } from "react";
import styles from "../styles/FindProjects.module.css";
import NavigationBar from "./NavigationBar";
import API from "../api.js";

function FindProjects() {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    budget: "",
    duration: "",
  });

  const accessToken = localStorage.getItem("access_token");

  const fetchProjects = async (appliedFilters = filters) => {
    try {
      let query = [];
      if (appliedFilters.search) query.push(`search=${appliedFilters.search}`);
      if (appliedFilters.category)
        query.push(`category__icontains=${appliedFilters.category}`);
      if (appliedFilters.budget) query.push(`budget__lte=${appliedFilters.budget}`);
      if (appliedFilters.duration)
        query.push(`duration__lte=${appliedFilters.duration}`);

      const queryString = query.length > 0 ? `?${query.join("&")}` : "";

      const res = await fetch(`http://127.0.0.1:8000/api/projects/${queryString}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        console.error("Failed to fetch projects");
        setProjects([]);
      }
    } catch (err) {
      console.error(err);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleFilter = (e) => {
    e.preventDefault();
    fetchProjects();
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
                placeholder="Filter by skill/category"
                value={filters.category}
                onChange={handleChange}
              />
              <input
                type="number"
                name="budget"
                placeholder="Max Budget"
                value={filters.budget}
                onChange={handleChange}
              />
              <input
                type="number"
                name="duration"
                placeholder="Max Duration (days)"
                value={filters.duration}
                onChange={handleChange}
              />
              <button type="submit">Apply Filters</button>
            </form>
          </div>

          {/* Projects List */}
          <div className={styles.card}>
            <h2>Project Results</h2>
            {projects.length === 0 ? (
              <p>No projects found.</p>
            ) : (
              <div className={styles.projectGrid}>
                {projects.map((project) => (
                  <div key={project.id} className={styles.projectCard}>
                    <strong>{project.title}</strong>
                    <p>{project.description}</p>
                    <p>
                      <strong>Category:</strong> {project.category} |{" "}
                      <strong>Budget:</strong> ${project.budget} |{" "}
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
