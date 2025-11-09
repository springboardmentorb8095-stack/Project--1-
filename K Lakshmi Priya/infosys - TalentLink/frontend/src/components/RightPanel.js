// src/components/RightPanel.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaEdit } from "react-icons/fa";
import api from "../api/axios";
import NotificationsDropdown from "../pages/NotificationsDropdown";

export default function RightPanel({ type, onClose }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const isLoggedIn = () => !!token;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Logging out...");
        setTimeout(() => handleLogout(), 3000);
      } else {
        setError("Failed to load profile.");
      }
      setProfile(null);
    }
  };

  useEffect(() => {
    if (isLoggedIn() && type === "profile") fetchProfile();
  }, [type]);

  // Early returns for different states
  if (type === "profile" && error) {
    return (
      <div className="relative flex flex-col h-full rounded-l-xl shadow-2xl overflow-hidden p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl dark:text-gray-100 font-bold hover:rotate-90 transform transition-all duration-300 "
        >
          ×
        </button>
        <p className="text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2 mb-4 text-sm animate-bounceIn">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full rounded-l-xl shadow-2xl overflow-hidden transition-all duration-500 bg-gray-50 dark:bg-gray-900">
      {/* Close button */}
      <div className="flex justify-end items-center px-4 py-3 z-10">
        <button
          onClick={onClose}
          className="text-2xl dark:text-gray-100 font-bold hover:rotate-90 transform transition-all duration-300"
        >
          ×
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 z-10">
        {/* Profile Panel */}
        {type === "profile" && (
          <>
            {!profile ? (
              <div className="text-center text-gray-500 dark:text-gray-100 animate-pulse mt-10">
                Loading profile...
              </div>
            ) : (
              <div className="mt-4 space-y-6 animate-fadeIn">
                <div className="relative bg-white/80 dark:bg-gray-800 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-indigo-100 dark:border-indigo-700 hover:shadow-xl transition-all duration-300 group">
                  {/* Glow border */}
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent pointer-events-none group-hover:border-indigo-400 group-hover:animate-glow"></div>

                  <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 border-b border-indigo-200 dark:border-indigo-600 pb-2 flex items-center gap-2">
                    ✨ Your Profile
                  </h3>

                  <div className="space-y-2 text-gray-900 dark:text-gray-100">
                    <p>
                      <strong>Full Name:</strong> {profile.full_name || "N/A"}
                    </p>
                    <p>
                      <strong>Rating:</strong> ⭐ {profile.avg_rating || "N/A"}
                    </p>
                    <p>
                      <strong>Hourly Rate:</strong> {profile.hourly_rate || "N/A"}
                    </p>
                    <p>
                      <strong>Availability:</strong> {profile.availability || "N/A"}
                    </p>
                    {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
                    {profile.location && <p><strong>Location:</strong> {profile.location}</p>}
                    {profile.skills?.length > 0 && (
                      <p>
                        <strong>Skills:</strong>{" "}
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                          {profile.skills.map((s) => s.name).join(", ")}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => navigate("/profile")}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 active:scale-95 shadow-md"
                    >
                      <FaEdit /> Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105 active:scale-95 shadow-md"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Notifications Panel */}
        {type === "notifications" && (
          <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm p-2 rounded-xl shadow-md border border-indigo-100 dark:border-indigo-700 h-full animate-fadeIn">
            <NotificationsDropdown />
          </div>
        )}
      </div>
    </div>
  );
}
