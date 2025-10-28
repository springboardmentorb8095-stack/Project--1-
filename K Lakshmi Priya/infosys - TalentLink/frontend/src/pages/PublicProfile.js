import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function PublicProfile() {
  const { id } = useParams(); // user ID from URL
  const [profile, setProfile] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
  
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{profile.full_name}</h1>
      <p><strong>Bio:</strong> {profile.bio || "N/A"}</p>
      <p><strong>Location:</strong> {profile.location || "N/A"}</p>
      <p><strong>Availability:</strong> {profile.availability || "N/A"}</p>
      <p><strong>Hourly Rate:</strong> {profile.hourly_rate ? `$${profile.hourly_rate}` : "N/A"}</p>

      <div style={{ marginTop: "1rem" }}>
        <strong>Skills:</strong>
        <ul>
          {profile.skills && profile.skills.length > 0 ? (
            profile.skills.map(skill => <li key={skill.id}>{skill.name}</li>)
          ) : (
            <li>No skills listed</li>
          )}
        </ul>
      </div>

            

      {profile && profile.id && currentUser?.id !== profile.id && (
        <button
          style={{
            marginTop: "1rem",
            backgroundColor: "#007bff",
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "4px"
          }}
          onClick={() => navigate(`/messages/${profile.id}`)}
        >
          Message
        </button>
      )}



      <div style={{ marginTop: "2rem" }}>
        <h3>Portfolio</h3>
        {portfolioItems.length === 0 ? (
          <p>No portfolio items available.</p>
        ) : (
          <ul>
            {portfolioItems.map(item => (
              <li key={item.id} style={{ marginBottom: "1rem" }}>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.url}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}

export default PublicProfile;
