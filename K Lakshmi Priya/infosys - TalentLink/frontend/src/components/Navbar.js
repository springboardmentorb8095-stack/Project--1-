import { useLocation } from "react-router-dom";

export default function Navbar({ onOpenPanel }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const linkClass = (path) =>
    `flex items-center px-4 py-2 rounded-md transition duration-200 ${
      pathname === path
        ? "bg-white/30 text-white font-semibold shadow-sm"
        : "text-white hover:bg-white/20"
    }`;

  return (
    <nav
      className="flex justify-between items-center px-8 py-3 shadow-md backdrop-blur-sm"
      style={{
        background: "linear-gradient(90deg, #4f46e5 0%, #9333ea 50%, #ec4899 100%)",
      }}
    >
      {/* Brand / User Welcome */}
      <h1 className="text-2xl font-bold text-white tracking-wide drop-shadow-sm">
        {user ? `Welcome, ${user.name}` : "FreelanceHub"}
      </h1>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-4">
        {/* Profile Panel */}
        <button
          onClick={() => onOpenPanel("profile")}
          className={linkClass("/profile")}
          title="Profile"
        >
          👤 <span className="ml-1 hidden sm:inline">Profile</span>
        </button>

        {/* Notifications Panel */}
        <button
          onClick={() => onOpenPanel("notifications")}
          className={linkClass("/notifications")}
          title="Notifications"
        >
          🔔 <span className="ml-1 hidden sm:inline">Notifications</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="ml-2 bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
