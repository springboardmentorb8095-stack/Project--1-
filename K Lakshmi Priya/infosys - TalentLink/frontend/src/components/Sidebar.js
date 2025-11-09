import { Link, useLocation } from "react-router-dom";
import { FaFolderOpen, FaFileContract, FaComments, FaUser, FaHome } from "react-icons/fa";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isClient = user?.role === "client";
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
     ${
       pathname === path
         ? "bg-white/30 text-white shadow-md backdrop-blur-sm"
         : "text-white/90 hover:bg-white/20 hover:text-white"
     }`;

  return (
    <aside
      className="w-64 h-screen p-6 flex flex-col justify-between shadow-lg border-r border-white/20"
      style={{
        background:
          "linear-gradient(180deg, #4f46e5 0%, #9333ea 50%, #ec4899 100%)",
      }}
    >
      {/* ===== Brand Header ===== */}
      <div>
        <Link to="/" className="flex items-center space-x-2 mb-10">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-md tracking-wide">
            TalentLink
          </h1>
        </Link>

        {/* ===== Navigation Links ===== */}
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

      {/* ===== Footer / User Info ===== */}
      {user && (
        <div className="pt-6 border-t border-white/20 text-white/90 text-sm">
          <p className="font-semibold text-white text-base">{user?.username || "User"}</p>
          <p className="capitalize text-white/80">{user?.role}</p>
        </div>
      )}
    </aside>
  );
}
