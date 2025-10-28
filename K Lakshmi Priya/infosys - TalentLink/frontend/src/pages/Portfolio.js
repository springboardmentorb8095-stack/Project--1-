import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Portfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get("portfolio/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`portfolio/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  if (loading) return <p>Loading portfolio...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h3>Portfolio</h3>
      <Link to="/portfolio/add">➕ Add New Project</Link>

      {items.length === 0 ? (
        <p>No portfolio items yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} style={{ marginBottom: "1rem" }}>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.url}
              </a>
              <br />
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Portfolio;
