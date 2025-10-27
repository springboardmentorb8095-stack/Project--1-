import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FreelancerDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user] = useState(
    JSON.parse(localStorage.getItem("user")) || { username: "Freelancer" }
  );

  useEffect(() => {
    // Simulated data fetching
    const savedProjects =
      JSON.parse(localStorage.getItem("freelancerProjects")) || [];
    setProjects(savedProjects);

    setMessages([
      { id: 1, sender: "Client_A", text: "Project update needed", time: "2h ago" },
      { id: 2, sender: "Client_B", text: "Proposal accepted!", time: "5h ago" },
    ]);

    setNotifications([
      { id: 1, message: "New contract assigned 📄", type: "contract" },
      { id: 2, message: "Message from Client_B 💬", type: "message" },
    ]);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-blue-700 dark:text-blue-400 mb-6">
            👋 {user.username}
          </h2>

          {[
            { label: "📊 Dashboard", path: "/freelancer-dashboard" },
            { label: "📁 Projects", path: "/projects" },
            { label: "🔍 Find Projects", path: "/projects-search" },
            { label: "💬 Messages", path: "/chat/1" },
            { label: "📄 Contracts", path: "/contracts" },
            { label: "📈 Reports", path: "/reports" },
          ].map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className="py-2 px-4 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer transition-colors font-medium"
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-4">
          <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
            🔔 Notifications
          </h3>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No new alerts</p>
          ) : (
            notifications.map((note) => (
              <div
                key={note.id}
                className="text-sm bg-blue-50 dark:bg-gray-800 p-2 rounded-md mb-2"
              >
                {note.message}
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Freelancer Dashboard
          </h1>
          <button
            onClick={() => navigate("/my-profile")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
          >
            Edit Profile
          </button>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 p-6 rounded-xl shadow-lg text-center transform hover:-translate-y-1 transition-all">
            <div className="text-4xl font-bold">₹12,870</div>
            <div className="text-gray-700 dark:text-gray-200">Total Earnings</div>
          </div>
          <div className="bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 p-6 rounded-xl shadow-lg text-center transform hover:-translate-y-1 transition-all">
            <div className="text-3xl font-bold">{projects.length}</div>
            <div className="text-gray-700 dark:text-gray-200">Active Projects</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-700 p-6 rounded-xl shadow-lg text-center transform hover:-translate-y-1 transition-all">
            <div className="text-3xl font-bold">
              {projects.filter((p) => p.status === "Completed").length}
            </div>
            <div className="text-gray-700 dark:text-gray-200">
              Projects Completed
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🗂️ Your Projects</h2>
          {projects.length === 0 ? (
            <p className="text-gray-500">You haven’t joined any projects yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-xl transition-all"
                >
                  <h3 className="font-semibold text-lg mb-1 text-blue-700 dark:text-blue-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-1">
                    💰 Budget: {project.budget}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-1">
                    🧠 Skills: {project.skills}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-1">
                    📅 Deadline: {project.deadline}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    📌 Status:{" "}
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {project.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Messages Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">💬 Recent Messages</h2>
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet.</p>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 last:border-none"
                >
                  <div>
                    <strong className="text-blue-600 dark:text-blue-400">
                      {msg.sender}
                    </strong>
                    : {msg.text}
                  </div>
                  <span className="text-gray-400 text-sm">{msg.time}</span>
                </div>
              ))}
              <div className="flex justify-center">
                <button
                  onClick={() => navigate("/chat/1")}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  Open Chat
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Recommended & Engagement Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-700 p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold mb-3">🔔 Recommended Projects</h3>
            <p className="mb-3">Millions Lager - ₹500</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-semibold">
              Join Now
            </button>
          </div>

          <div className="bg-gradient-to-r from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-700 p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold mb-3">💬 Engage with Clients</h3>
            <p className="mb-3"># Freelancer Community</p>
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg font-semibold">
              Join Chat
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FreelancerDashboard;
