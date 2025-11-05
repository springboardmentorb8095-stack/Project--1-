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
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-indigo-600">Portfolio</h3>
        <Link
          to="/portfolio/add"
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
        >
          ➕ Add
        </Link>
      </div>

      {items.length === 0 ? (
        <p>No portfolio items yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <strong className="text-lg">{item.title}</strong>
                  <p className="mt-1 text-gray-700">{item.description}</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-1 block"
                  >
                    {item.url}
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Portfolio;
