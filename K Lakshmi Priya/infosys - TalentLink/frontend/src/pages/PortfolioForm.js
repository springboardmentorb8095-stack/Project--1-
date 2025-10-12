import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function PortfolioForm() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(
        "portfolio/",
        { title, url, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Portfolio item added successfully!");
      navigate("/portfolio");
    } catch (err) {
      console.error("Error adding portfolio:", err);
      alert("Failed to add item.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Add Portfolio Item</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Title:<br />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>URL:<br />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://github.com/username/project"
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Description:<br />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Brief description of this project..."
            />
          </label>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add"}
        </button>
      </form>
    </div>
  );
}

export default PortfolioForm;
