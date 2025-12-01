import { useEffect, useState } from "react";
import { isLoggedIn, getToken } from "../utils/auth";
import axios from "axios";
import api from "../api/axios";


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (storedUser) {
      
      console.log(storedUser.role);
      fetchDashboardData(storedUser.role);
    }
  }, []);

  const fetchDashboardData = async (role) => {
    try {
      const token = getToken();
      const url =
        role === "client" ? "dashboard/client/" : "dashboard/freelancer/"

const res = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDashboardData(res.data);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn()) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          You are not logged in
        </h1>
        <p className="text-gray-700">
          Please log in to access your dashboard.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  const isClient = user?.role === "client";

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-extrabold mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-lg opacity-90">
          {isClient
            ? "Manage your projects, review proposals, and hire top freelancers."
            : "Browse exciting projects, submit proposals, and manage your contracts."}
        </p>
      </section>

      {/* Quick Stats */}
{dashboardData ? (
  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {isClient ? (
      <>
        <StatCard color="blue" value={dashboardData.active_projects} label="Open Projects" />
        <StatCard color="green" value={dashboardData.new_proposals_received} label="New Proposals" />
        <StatCard color="yellow" value={dashboardData.total_contracts} label="Total Contracts" />
        <StatCard color="purple" value={dashboardData.active_contracts} label="Active Contracts" />
      </>
    ) : (
      <>
        <StatCard color="blue" value={dashboardData.proposals_pending} label="Active Proposals" />
        <StatCard color="blue" value={dashboardData.proposals_submitted} label="Proposals Submitted" />
        <StatCard color="green" value={dashboardData.active_contracts} label="Active Contracts" />
        <StatCard color="yellow" value={dashboardData.completed_contracts} label="Completed Contracts" />
      </>
    )}
  </section>
) : (
  <div className="text-center text-gray-600">No dashboard data available.</div>
)}


      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-teal-400 to-green-500 text-white rounded-xl p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Get Started Today</h2>
          <p className="opacity-90">
            {isClient
              ? "Post new projects, review proposals, and hire skilled freelancers quickly."
              : "Find projects that match your skills and grow your freelance career."}
          </p>
        </div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4305/4305493.png"
          alt="Dashboard Illustration"
          className="w-32 h-32"
        />
      </section>
    </div>
  );
}

/** Reusable stat card */
function StatCard({ color, value, label }) {
  const colorMap = {
    blue: "text-blue-500",
    green: "text-green-500",
    yellow: "text-yellow-500",
    purple: "text-purple-500",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start hover:shadow-xl transition">
      <span className={`${colorMap[color]} font-bold text-xl mb-2`}>
        {value ?? 0}
      </span>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  );
}
