// src/components/RightPanel.js
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import NotificationsDropdown from "../pages/NotificationsDropdown";

export default function RightPanel({ type, onClose }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const isLoggedIn = () => !!token;

  const fetchProfile = async () => {
    try {
      const res = await api.get("profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        setProfile(null);
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to load profile.");
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn() && type === "profile") fetchProfile();
  }, [type]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-lg font-semibold text-gray-800 capitalize">
          {type}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
        >
          ×
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {type === "profile" && (
          <>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {profile ? (
              <div className="space-y-6 mt-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-3">
                  <h3 className="text-xl font-bold text-indigo-600">Your Profile</h3>

                  <p>
                    <strong>Full Name:</strong> {profile.full_name || "N/A"}
                  </p>
                  <p>
                    <strong>Hourly Rate:</strong> {profile.hourly_rate || "N/A"}
                  </p>
                  <p>
                    <strong>Availability:</strong> {profile.availability || "N/A"}
                  </p>
                  {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
                  {profile.location && <p><strong>Location:</strong> {profile.location}</p>}
                  {Array.isArray(profile.skills) && profile.skills.length > 0 && (
                    <p>
                      <strong>Skills:</strong>{" "}
                      {profile.skills.map((skill) => skill.name).join(", ")}
                    </p>
                  )}

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => navigate("/profile")}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>

              </div>
            ) : !error ? (
              <p>Loading profile...</p>
            ) : null}
          </>
        )}

        {type === "notifications" && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full">
            <NotificationsDropdown />
          </div>
        )}
      </div>
    </div>
  );
}
