import { Link, useLocation } from "react-router-dom";
import { FaFolderOpen, FaFileContract, FaComments, FaUser, FaHome } from "react-icons/fa";

export default function Sidebar({ className }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const isClient = user?.role === "client";
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
     ${
       pathname === path
         ? "bg-white/30 text-white shadow-md backdrop-blur-sm dark:bg-white/20 dark:text-gray-100"
         : "text-white/90 hover:bg-white/20 hover:text-white dark:text-gray-200 dark:hover:bg-gray-700/50"
     }`;

  return (
    <aside
      className={`w-64 h-screen p-6 flex flex-col justify-between shadow-lg border-r border-white/20
                  bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600
                  dark:from-indigo-800 dark:via-purple-800 dark:to-pink-900 transition-all duration-300 ${className}`}
    >
      {/* Brand */}
      <div>
        <Link to="/" className="flex items-center space-x-2 mb-10">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-md tracking-wide">
            TalentLink
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2 text-sm font-medium">
          <Link to="/" className={linkClass("/")}>
            <FaHome size={18} />
            <span>Home</span>
          </Link>

          <Link to="/projects" className={linkClass("/projects")}>
            <FaFolderOpen size={18} />
            <span>{isClient ? "My Projects" : "Browse Projects"}</span>
          </Link>

          <Link to="/contracts" className={linkClass("/contracts")}>
            <FaFileContract size={18} />
            <span>Contracts</span>
          </Link>

          <Link to="/messages" className={linkClass("/messages")}>
            <FaComments size={18} />
            <span>Messages</span>
          </Link>

          <Link to="/pro" className={linkClass("/pro")}>
            <FaUser size={18} />
            <span>Proposals</span>
          </Link>
        </nav>
      </div>

      {/* Footer / User Info */}
      {user && (
        <div className="pt-6 border-t border-white/20 text-white/90 text-sm dark:text-gray-200">
          <p className="font-semibold text-white dark:text-gray-100 text-base">{user?.username || "User"}</p>
          <p className="capitalize text-white/80 dark:text-gray-300">{user?.role}</p>
        </div>
      )}
    </aside>
  );
}
