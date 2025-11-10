import React, { useEffect, useState } from "react";
import styles from "../styles/FindFreelancers.module.css";
import NavigationBar from "./NavigationBar";

const API_URL = "http://127.0.0.1:8000/api/accounts";

function FindFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [filters, setFilters] = useState({
    skills: "",
    minRate: "",
    maxRate: "",
    availability: "",
  });

  const accessToken = localStorage.getItem("access_token");

  // Fetch freelancers with filters
  const fetchFreelancers = async (appliedFilters = filters) => {
    try {
      let query = [];
      if (appliedFilters.skills)
        query.push(`skills__icontains=${appliedFilters.skills}`);
      if (appliedFilters.minRate)
        query.push(`hourly_rate__gte=${appliedFilters.minRate}`);
      if (appliedFilters.maxRate)
        query.push(`hourly_rate__lte=${appliedFilters.maxRate}`);
      if (appliedFilters.availability)
        query.push(
          `availability=${appliedFilters.availability === "true" ? true : false}`
        );

      const queryString = query.length > 0 ? `?${query.join("&")}` : "";

      const res = await fetch(`${API_URL}/profiles/${queryString}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.ok) {
        const data = await res.json();
        setFreelancers(data);
      } else {
        console.error("Failed to fetch freelancers");
        setFreelancers([]);
      }
    } catch (err) {
      console.error(err);
      setFreelancers([]);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchFreelancers();
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainSection}>
        {/* Left Sidebar */}
        <div className={styles.sidebar}>
          <NavigationBar />
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          <h1>Find Freelancers</h1>

          {/* Filter Form */}
          <div className={styles.card}>
            <h2>Filter Freelancers</h2>
            <form onSubmit={handleFilter} className={styles.filterForm}>
              <input
                type="text"
                name="skills"
                placeholder="Skills (e.g., Python, React)"
                value={filters.skills}
                onChange={handleChange}
              />
              <input
                type="number"
                name="minRate"
                placeholder="Min Hourly Rate"
                value={filters.minRate}
                onChange={handleChange}
              />
              <input
                type="number"
                name="maxRate"
                placeholder="Max Hourly Rate"
                value={filters.maxRate}
                onChange={handleChange}
              />
              <select
                name="availability"
                value={filters.availability}
                onChange={handleChange}
              >
                <option value="">Availability</option>
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
              <button type="submit">Apply Filters</button>
            </form>
          </div>

          {/* Freelancer Results */}
          <div className={styles.card}>
            <h2>Freelancer Results</h2>
            {freelancers.length === 0 ? (
              <p>No freelancers found.</p>
            ) : (
              <div className={styles.freelancerGrid}>
                {freelancers.map((freelancer) => (
                  <div key={freelancer.id} className={styles.freelancerCard}>
                    <strong>{freelancer.user.username}</strong>
                    <p>Skills: {freelancer.skills || "No skills listed"}</p>
                    <p>Hourly Rate: ${freelancer.hourly_rate}</p>
                    <p>
                      Availability:{" "}
                      {freelancer.availability ? "Available" : "Not Available"}
                    </p>
                    <p>
                      Portfolio:{" "}
                      {freelancer.portfolio || "No portfolio provided"}
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

export default FindFreelancers;
