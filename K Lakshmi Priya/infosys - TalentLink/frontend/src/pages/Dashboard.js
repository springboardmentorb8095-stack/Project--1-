import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { isLoggedIn } from "../utils/auth";
import ProjectList from "./ProjectList";
import Portfolio from "./Portfolio";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const fetchProfile = async () => {
    try {
      const res = await api.get("profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        // Do NOT redirect automatically
        // Instead, clear token and reset profile to null
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        setProfile(null);
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to load profile");
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      fetchProfile();
    } else {
      // If not logged in, clear any previous profile or error
      setProfile(null);
      setError(null);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setProfile(null);
    navigate("/");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to FreelancerHub</h1>
      <p>
        This is a platform for freelancers to manage their profile, set
        availability, and showcase their skills.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 3fr",
          gap: "10px",
        }}
      >
        <div>
          {!isLoggedIn() ? (
            <div>
              <p>Please log in or register to get started:</p>
              <button onClick={() => navigate("/login")}>Login</button>
              <button
                onClick={() => navigate("/register")}
                style={{ marginLeft: "1rem" }}
              >
                Register
              </button>
            </div>
          ) : (
            <div style={{ marginTop: "2rem" }}>
              <h2>Your Profile</h2>
              {error && <p style={{ color: "red" }}>{error}</p>}

              {profile ? (
                <>
                  <div
                    style={{
                      backgroundColor: "#f4f4f4",
                      padding: "1rem",
                      borderRadius: "5px",
                      maxWidth: "400px",
                      marginTop: "1rem",
                    }}
                  >
                    <p>
                      <strong>Full Name:</strong> {profile.full_name || "N/A"}
                    </p>
                    <p>
                      <strong>Hourly Rate:</strong>{" "}
                      {profile.hourly_rate || "N/A"}
                    </p>
                    <p>
                      <strong>Availability:</strong>{" "}
                      {profile.availability || "N/A"}
                    </p>
                    {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
                    {profile.location && (
                      <p>
                        <strong>Location:</strong> {profile.location}
                      </p>
                    )}
                    {Array.isArray(profile.skills) && profile.skills.length > 0 && (
                      <p>
                        <strong>Skills:</strong>{" "}
                        {profile.skills.map((skill) => skill.name).join(", ")}
                      </p>
                    )}

                    <div style={{ marginTop: "1rem" }}>
                      <button onClick={() => navigate("/profile")}>
                        Edit Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        style={{ marginLeft: "1rem" }}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : !error ? (
                <p>Loading profile...</p>
              ) : null}


              <Portfolio />
            </div>
          )}
        </div>

        <div>
          {/* AVAILABLE PROJECTS */}
          <ProjectList />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
