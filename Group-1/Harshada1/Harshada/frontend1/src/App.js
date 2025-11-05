import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";

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
import ProjectsSearchPage from "./pages/ProjectsSearchPage";
import ContractsPage from "./pages/ContractsPage";
import ChatWindow from "./components/Chat/ChatWindow";
import MessageList from "./components/Sidebar/MessageList";

import NotificationBell from "./components/NotificationBell";
import NotificationToast from "./components/NotificationToast";
import { initWebSocket } from "./utils/websocket";
import { registerServiceWorker, subscribeUserToPush } from "./utils/push";
import "./styles/notifications.css";
import "./pages/Auth.css";

const API_ROOT = process.env.REACT_APP_API_ROOT || "http://127.0.0.1:8000";
const VAPID_PUBLIC = process.env.REACT_APP_VAPID_PUBLIC_KEY;

// ✅ Protected Route Wrapper
function ProtectedRoute({ element }) {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
}

// ================= HeaderBar =================
function HeaderBar({ theme, toggleTheme, bellProps, onLogout }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user =
    JSON.parse(localStorage.getItem("user")) || {
      username: "User",
      email: "user@example.com",
      role: "Freelancer",
    };

  return (
    <header
      className={`flex justify-between items-center p-4 px-8 shadow-md sticky top-0 z-40 ${
        theme === "dark"
          ? "bg-gray-900 text-white border-b border-gray-700"
          : "bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white"
      } transition-all duration-300`}
    >
      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-bold tracking-tight flex items-center gap-2 cursor-pointer"
      >
        <span className="text-white">TalentLink</span>
        <span className="text-yellow-300">Dashboard</span>
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-5 relative">
        <NotificationBell {...bellProps} />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="bg-white text-gray-800 px-3 py-1 rounded-full font-semibold text-sm hover:bg-gray-100 shadow"
        >
          {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {/* Profile Avatar */}
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-full cursor-pointer hover:bg-opacity-30 transition"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="User"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <div>
            <p className="text-sm font-semibold capitalize">{user.username}</p>
            <p className="text-xs opacity-80">{user.role}</p>
          </div>
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div
            className={`absolute right-0 mt-14 w-44 rounded-lg shadow-lg ${
              theme === "dark"
                ? "bg-gray-800 text-gray-200 border border-gray-700"
                : "bg-white text-gray-800 border border-gray-200"
            }`}
          >
            <button
              onClick={() => navigate("/my-profile")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              ✏️ Edit Profile
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              💬 Messages
            </button>
            <button
              onClick={onLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-800"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

// ================= Layout =================
function Layout({ children, theme, toggleTheme, bellProps, onLogout }) {
  const location = useLocation();

  const showTopBar = [
    "dashboard",
    "projects",
    "my-projects",
    "post-project",
    "contracts",
    "chat",
  ].some((path) => location.pathname.includes(path));

  const showSidebar = [
    "dashboard",
    "projects",
    "my-projects",
    "contracts",
    "chat",
  ].some((path) => location.pathname.includes(path));

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {showTopBar && (
        <HeaderBar
          theme={theme}
          toggleTheme={toggleTheme}
          bellProps={bellProps}
          onLogout={onLogout}
        />
      )}
      <div
        className={`flex ${showSidebar ? "gap-6 p-6" : "p-6"}`}
        style={{ position: "relative", zIndex: 1 }}
      >
        {showSidebar && <MessageList />}
        <main className="flex-1 relative">{children}</main>
      </div>
    </div>
  );
}

// ================= Main App =================
function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications")) || []
  );
  const [settings, setSettings] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const audioRef = useRef(new Audio("/notification.mp3"));
  const token = localStorage.getItem("token");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // Helper function to update state and localStorage
  const updateNotificationsState = (newNotifications) => {
    setNotifications(newNotifications);
    localStorage.setItem("notifications", JSON.stringify(newNotifications));
  };

  // ✅ NEW LOGIC: Marks a single notification as read and calls the API
  const markNotificationAsRead = (id) => {
    // 1. Update local state using is_read
    const newNotifs = notifications.map((n) =>
      // Ensure we target the 'is_read' property
      n.id === id ? { ...n, is_read: true } : n
    );
    updateNotificationsState(newNotifs);

    // 2. Call API (non-blocking)
    if (token) {
      fetch(`${API_ROOT}/api/notifications/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }), // Backend still expects 'read: true'
      }).catch(e => console.error("Failed to mark as read:", e));
    }
  };
  
  // ✅ NEW LOGIC: Marks ALL notifications as read and calls the API
  const markAllNotificationsAsRead = () => {
    // 1. Update local state using is_read
    const newNotifs = notifications.map(n => 
      ({ ...n, is_read: true })
    );
    updateNotificationsState(newNotifs);
    
    // 2. Call API (non-blocking)
    if (token) {
        fetch(`${API_ROOT}/api/notifications/mark_all_read/`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        }).catch(e => console.error("Failed to mark all as read:", e));
    }
  };

  // Notifications loading (Initial Fetch)
  useEffect(() => {
    async function load() {
      if (!token) return;
      try {
        const [resN, resS] = await Promise.all([
          fetch(`${API_ROOT}/api/notifications/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_ROOT}/api/notification-settings/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (resN.ok) {
          const data = await resN.json();
          // ✅ CRITICAL FIX: Map incoming data to use consistent 'is_read'
          const standardizedData = data.map(n => ({...n, is_read: n.read || n.is_read || false}));
          updateNotificationsState(standardizedData);
        }
        if (resS.ok) setSettings(await resS.json());
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [token]);

  // Realtime updates
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) return;

    const ws = initWebSocket(user.id, (data) => {
      const notif = {
        id: data.id || Date.now(),
        message: data.message || "",
        // ✅ CRITICAL FIX: New notifications must be 'is_read: false'
        is_read: false, 
        created_at: new Date().toISOString(),
        from_user: data.from_user || "System", 
        type: data.type || "System Update",
      };
      
      // Use setNotifications function form for correct state based on current notifications
      setNotifications(prev => {
        const newNotifs = [notif, ...prev];
        localStorage.setItem("notifications", JSON.stringify(newNotifs));
        return newNotifs;
      });
      
      if (settings?.inapp_sound_enabled !== false) {
        try {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        } catch (e) {}
      }
      setToastMsg(notif.message);
    });

    // We must depend on `settings` for the sound logic, but not `notifications` to prevent socket reconnection loop
    // Re-establishing the dependency on `notifications` here is fine if it prevents the stale state closure issue.
    return () => ws && ws.close();
  }, [settings, token, notifications]);


  const bellProps = {
    notifications,
    // Pass the dedicated marking functions
    onMarkAsRead: markNotificationAsRead,
    onMarkAllRead: markAllNotificationsAsRead,
  };

  return (
    <Router>
      <Layout
        theme={theme}
        toggleTheme={toggleTheme}
        bellProps={bellProps}
        onLogout={handleLogout}
      >
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/client-dashboard"
            element={<ProtectedRoute element={<ClientDashboard />} />}
          />
          <Route
            path="/freelancer-dashboard"
            element={<ProtectedRoute element={<FreelancerDashboard />} />}
          />
          <Route
            path="/client-profile"
            element={<ProtectedRoute element={<Profile_Client />} />}
          />
          <Route
            path="/freelancer-profile"
            element={<ProtectedRoute element={<Profile_Freelancer />} />}
          />
          <Route
            path="/my-profile"
            element={<ProtectedRoute element={<MyProfile />} />}
          />
          <Route
            path="/projects"
            element={<ProtectedRoute element={<ProjectsPage />} />}
          />
          <Route
            path="/projects-search"
            element={<ProtectedRoute element={<ProjectsSearchPage />} />}
          />
          <Route
            path="/my-projects"
            element={<ProtectedRoute element={<MyProjects />} />}
          />
          <Route
            path="/post-project"
            element={<ProtectedRoute element={<PostProject />} />}
          />
          <Route
            path="/contracts"
            element={<ProtectedRoute element={<ContractsPage />} />}
          />
          <Route
            path="/chat"
            element={<ProtectedRoute element={<ChatWindow />} />}
          />
          <Route
            path="/chat/:conversationId"
            element={<ProtectedRoute element={<ChatWindow />} />}
          />
        </Routes>

        {toastMsg && (
          <NotificationToast
            message={toastMsg}
            onClose={() => setToastMsg(null)}
          />
        )}
      </Layout>
    </Router>
  );
}

export default App;