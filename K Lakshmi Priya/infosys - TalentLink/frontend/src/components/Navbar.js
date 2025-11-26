import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaUserCircle, FaBell} from "react-icons/fa";


export default function Navbar({ onOpenPanel }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const { pathname } = useLocation();

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const linkClass = (path) =>
    `flex items-center px-4 py-2 rounded-md transition duration-200 ${
      pathname === path
        ? "bg-white/30 text-white font-semibold shadow-sm dark:bg-white/20 dark:text-gray-100"
        : "text-white hover:bg-white/20 dark:text-gray-200 dark:hover:bg-gray-700/50"
    }`;

  return (
    <nav
      className="flex justify-between items-center px-8 py-3 shadow-md backdrop-blur-sm
                 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500
                 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-700 transition-all duration-300"
    >
      {/* Brand / Welcome */}
      <h1 className="text-2xl font-bold text-white tracking-wide drop-shadow-sm">
        {user ? `Welcome, ${user.name}` : "TalentLink"}
      </h1>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        {/* Profile */}
        <button
          onClick={() => onOpenPanel("profile")}
          className={linkClass("/profile")}
          title="Profile"
        >
          <FaUserCircle className="text-2xl"/> 
        </button>

        {/* Notifications */}
        <button
          onClick={() => onOpenPanel("notifications")}
          className={linkClass("/notifications")}
          title="Notifications"
        >
          <FaBell className="text-2xl"/>
        </button>

        
        {/*s
        <button
          onClick={toggleTheme}
          className="text-white text-xl hover:scale-110 transition-transform"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
        */}

        
      </div>
    </nav>
  );
}
