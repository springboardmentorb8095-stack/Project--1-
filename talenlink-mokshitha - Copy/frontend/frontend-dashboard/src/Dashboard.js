import api from "./api";
import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState({
    profiles: [],
    skills: [],
    items: [],
    projects: [],
    proposals: [],
    contracts: [],
    messages: [],
    reviews: [],
  });

  const [activeBox, setActiveBox] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch API data
  useEffect(() => {
    const endpoints = {
      profiles: "profiles/",
      skills: "skills/",
      items: "items/",
      projects: "projects/",
      proposals: "proposals/",
      contracts: "contracts/",
      messages: "messages/",
      reviews: "reviews/",
    };

    Promise.all(
      Object.entries(endpoints).map(([key, url]) =>
        api
          .get(url)
          .then((res) => {
            console.log(`✅ ${key} data:`, res.data);
            return { key, data: res.data };
          })
          .catch(err => {
  if (err.response) {
    console.error("❌ API error response:", err.response.status, err.response.data);
  } else if (err.request) {
    console.error("❌ API no response (request made but no response):", err.request);
  } else {
    console.error("❌ API setup error:", err.message);
  }
  return { key, data: [] };
})

      )
    ).then((results) => {
      const newData = {};
      results.forEach((r) => {
        newData[r.key] = r.data;
      });
      setData(newData);
      setLoading(false);
    });
  }, []);

  // ✅ Render data nicely
  const renderContent = (key, list) => {
    switch (key) {
      case "profiles":
        return list.map((p) => (
          <div className="card" key={p.id}>
            <h3>{p.user_name}</h3>
            <p>
              <strong>Email:</strong> {p.email}
            </p>
            <p>
              <em>{p.bio}</em>
            </p>
          </div>
        ));
      case "skills":
        return list.map((s) => (
          <div className="card" key={s.id}>
            <h3>{s.name}</h3>
            <p>
              <strong>Level:</strong> {s.level}
            </p>
            <p>
              <strong>Profile ID:</strong> {s.profile}
            </p>
          </div>
        ));
      case "items":
        return list.map((i) => (
          <div className="card" key={i.id}>
            <h3>{i.name}</h3>
            <p>{i.description}</p>
            <p>
              <strong>Price:</strong> ${i.price}
            </p>
            <p>
              <strong>Owner ID:</strong> {i.owner}
            </p>
          </div>
        ));
      case "projects":
        return list.map((p) => (
          <div className="card" key={p.id}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <p>
              <strong>Owner ID:</strong> {p.owner}
            </p>
            <p>
              <strong>Skills Required:</strong>{" "}
              {p.skills_required?.join(", ") || "None"}
            </p>
          </div>
        ));
      case "proposals":
        return list.map((pr) => (
          <div className="card" key={pr.id}>
            <h3>Proposal #{pr.id}</h3>
            <p>{pr.description}</p>
            <p>
              <strong>Price:</strong> ${pr.price}
            </p>
            <p>
              <strong>Status:</strong> {pr.status}
            </p>
          </div>
        ));
      case "contracts":
        return list.map((c) => (
          <div className="card" key={c.id}>
            <h3>Contract #{c.id}</h3>
            <p>
              <strong>Proposal ID:</strong> {c.proposal}
            </p>
            <p>
              <strong>Status:</strong> {c.status}
            </p>
            <p>
              <strong>Start:</strong> {c.start_date}
            </p>
            <p>
              <strong>End:</strong> {c.end_date || "Ongoing"}
            </p>
          </div>
        ));
      case "messages":
        return list.map((m) => (
          <div className="card" key={m.id}>
            <h3>Message #{m.id}</h3>
            <p>
              <strong>From:</strong> {m.sender} → <strong>To:</strong>{" "}
              {m.receiver}
            </p>
            <p>{m.content}</p>
            <p>
              <em>{m.timestamp}</em>
            </p>
          </div>
        ));
      case "reviews":
        return list.map((r) => (
          <div className="card" key={r.id}>
            <h3>Review #{r.id}</h3>
            <p>
              <strong>Reviewer:</strong> {r.reviewer} → <strong>Reviewee:</strong>{" "}
              {r.reviewee}
            </p>
            <p>
              <strong>Rating:</strong> ⭐ {r.rating}/5
            </p>
            <p>{r.comment}</p>
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      {/* Navigation Bar */}
      <nav className="navbar">
        {Object.keys(data).map((key) => (
          <button
            key={key}
            className={`nav-btn ${activeBox === key ? "active" : ""}`}
            onClick={() => setActiveBox(key)}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </nav>

      <h1>TalentLink Dashboard</h1>

      {/* Show selected content */}
      {loading ? (
        <p>Loading data...</p>
      ) : activeBox ? (
        <div className="content-area">
          <h2>{activeBox.toUpperCase()}</h2>
          {data[activeBox].length === 0 ? (
            <p>No {activeBox} found.</p>
          ) : (
            renderContent(activeBox, data[activeBox])
          )}
        </div>
      ) : (
        <p>Select a section from above</p>
      )}
    </div>
  );
}

export default Dashboard;
