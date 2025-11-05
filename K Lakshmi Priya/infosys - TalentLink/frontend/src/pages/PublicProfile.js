import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function PublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const profileRes = await api.get(`/users/${id}/profile/`);
        const portfolioRes = await api.get(`/users/${id}/portfolio/`);
        setProfile(profileRes.data);
        setPortfolioItems(portfolioRes.data);
      } catch (err) {
        console.error("Error fetching public profile or portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicProfile();
  }, [id]);

  if (loading) return <p className="text-gray-500 text-center mt-10">Loading profile...</p>;
  if (!profile) return <p className="text-red-500 text-center mt-10">Profile not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">{profile.full_name}</h1>
        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">Bio:</span> {profile.bio || "N/A"}</p>
          <p><span className="font-semibold">Location:</span> {profile.location || "N/A"}</p>
          <p><span className="font-semibold">Availability:</span> {profile.availability || "N/A"}</p>
          <p><span className="font-semibold">Hourly Rate:</span> {profile.hourly_rate ? `$${profile.hourly_rate}` : "N/A"}</p>
        </div>

        <div className="mt-4">
          <span className="font-semibold">Skills:</span>
          <ul className="list-disc list-inside mt-1 text-gray-700">
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map(skill => <li key={skill.id}>{skill.name}</li>)
            ) : (
              <li>No skills listed</li>
            )}
          </ul>
        </div>

        {profile.id && currentUser?.id !== profile.id && (
          <button
            onClick={() => navigate(`/messages/${id}`)}
            className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition"
          >
            Message
          </button>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-xl p-8">
        <h3 className="text-2xl font-semibold mb-4 text-indigo-600">Portfolio</h3>
        {portfolioItems.length === 0 ? (
          <p className="text-gray-500">No portfolio items available.</p>
        ) : (
          <ul className="space-y-4 text-gray-700">
            {portfolioItems.map(item => (
              <li key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <strong className="block text-lg">{item.title}</strong>
                <p className="mt-1">{item.description}</p>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:underline mt-1 inline-block"
                  >
                    {item.url}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PublicProfile;
