import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

// Pages
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Profile_Client from "./pages/Profile_Client";
import Profile_Freelancer from "./pages/Profile_Freelancer";
import MyProfile from "./pages/MyProfile";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import ProjectsPage from "./pages/ProjectsPage";
import MyProjects from "./pages/MyProjects";
import PostProject from "./pages/PostProject";
import HomePage from "./pages/HomePage";
import ProjectsSearchPage from "./pages/ProjectsSearchPage";
import ContractsPage from "./pages/ContractsPage";
import ChatWindow from "./components/Chat/ChatWindow";


import MessageList from "./components/Sidebar/MessageList"; // ✅ Sidebar
import "./pages/Auth.css";

// ================= Header Component =================
function HeaderBar({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const user =
    JSON.parse(localStorage.getItem("user")) || {
      username: "Guest",
      name: "Unknown",
      email: "example@mail.com",
      role: "User",
      profilePhoto: null,
    };

  const hour = new Date().getHours();
  let greeting = "Hello";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/projects/search?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  return (
    <div
      className={`flex justify-between items-center p-3 px-5 ${
        theme === "dark"
          ? "bg-gray-900 text-white border-b border-gray-700"
          : "bg-blue-50 text-black border-b border-blue-100"
      } sticky top-0 z-50 transition-all duration-300`}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={`font-bold text-md ${
          theme === "dark" ? "text-blue-300" : "text-blue-600"
        }`}
      >
        ⬅ Back
      </button>

      {/* Greeting */}
      <div className="font-semibold text-lg">
        {greeting}, {user.username} 👋
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`px-3 py-1 rounded-lg outline-none border ${
              theme === "dark" ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
            }`}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold"
          >
            🔍
          </button>
        </form>

        {/* Contracts Button */}
        <button
          onClick={() => navigate("/contracts")}
          className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold"
        >
          Contracts
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`px-3 py-1 rounded-lg font-bold border ${
            theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
          }`}
        >
          {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <img
            src={
              user.profilePhoto ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Profile"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-600"
          />

          {dropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-64 p-4 rounded-xl shadow-lg ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}
            >
              <div className="text-center">
                <img
                  src={
                    user.profilePhoto ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt="Profile"
                  className="w-16 h-16 rounded-full mx-auto mb-2"
                />
                <h3 className="font-semibold">{user.username}</h3>
                <p className="text-sm opacity-80">{user.email}</p>
                <p className="text-xs bg-blue-600 text-white inline-block px-3 py-1 rounded-full mt-1">
                  {user.role}
                </p>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/my-profile");
                  }}
                  className="mt-3 bg-blue-600 text-white px-3 py-1 rounded-lg font-bold"
                >
                  ✏️ Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= Layout with Sidebar =================
function Layout({ children, theme, toggleTheme }) {
  const location = useLocation();
  const showTopBar =
    location.pathname.includes("dashboard") ||
    location.pathname.includes("projects") ||
    location.pathname.includes("my-projects") ||
    location.pathname.includes("post-project") ||
    location.pathname.includes("contracts");

  const showSidebar =
    location.pathname.includes("dashboard") ||
    location.pathname.includes("projects") ||
    location.pathname.includes("my-projects") ||
    location.pathname.includes("contracts");

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      } transition-colors duration-300`}
    >
      {showTopBar && <HeaderBar theme={theme} toggleTheme={toggleTheme} />}

      <div className={`flex ${showSidebar ? "gap-6 p-6" : "p-6"}`}>
        {showSidebar && <MessageList />}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

// ================= Main App =================
function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Router>
      <Layout theme={theme} toggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/client-profile" element={<Profile_Client />} />
          <Route path="/freelancer-profile" element={<Profile_Freelancer />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects-search" element={<ProjectsSearchPage />} />
          <Route path="/my-projects" element={<MyProjects />} />
          <Route path="/post-project" element={<PostProject />} />
          <Route path="/contracts" element={<ContractsPage />} />
          <Route path="/homepage" element={<HomePage />} />
	  <Route path="/chat/:conversationId" element={<ChatWindow />} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
