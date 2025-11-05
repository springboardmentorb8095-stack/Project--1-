import React, { useState } from "react";

function ProjectsSearchPage() {
  const [filters, setFilters] = useState({
    skill: "",
    minBudget: "",
    maxBudget: "",
    date: "",
  });

  const [projects] = useState([
    { title: "Landing Page Design", skill: "UI/UX", budget: 1500 },
    { title: "React Web App", skill: "React", budget: 3000 },
    { title: "API Integration", skill: "Backend", budget: 2500 },
  ]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    console.log("Filters applied:", filters);
  };

  return (
    <div
      style={{
        padding: "40px",
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#1e293b",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        📂 Find Projects
      </h2>

      {/* ===== Filter Bar ===== */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          padding: "20px 25px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          name="skill"
          value={filters.skill}
          onChange={handleChange}
          placeholder="Skill (e.g. React, Python)"
          style={inputStyle}
        />
        <input
          type="number"
          name="minBudget"
          value={filters.minBudget}
          onChange={handleChange}
          placeholder="Min Budget"
          style={inputStyle}
        />
        <input
          type="number"
          name="maxBudget"
          value={filters.maxBudget}
          onChange={handleChange}
          placeholder="Max Budget"
          style={inputStyle}
        />
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
          style={inputStyle}
        />
        <button onClick={handleApplyFilters} style={buttonStyle}>
          Apply Filters
        </button>
      </div>

      {/* ===== Projects List ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {projects.map((p, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h3
              style={{
                color: "#4f46e5",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              {p.title}
            </h3>
            <p style={{ color: "#475569", marginBottom: "6px" }}>
              🧠 Skill: {p.skill}
            </p>
            <p style={{ color: "#475569" }}>💰 Budget: ₹{p.budget}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Reusable Styles ===== */
const inputStyle = {
  flex: "1",
  minWidth: "160px",
  padding: "10px 14px",
  border: "1.5px solid #e2e8f0",
  borderRadius: "10px",
  background: "#f9fafb",
  color: "#1e293b",
  fontSize: "14px",
  transition: "all 0.3s ease",
};

const buttonStyle = {
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#fff",
  fontWeight: "600",
  border: "none",
  padding: "10px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 10px rgba(124, 58, 237, 0.3)",
};

export default ProjectsSearchPage;
