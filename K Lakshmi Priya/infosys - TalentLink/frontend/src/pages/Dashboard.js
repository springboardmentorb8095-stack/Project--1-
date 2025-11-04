import { useEffect, useState } from "react";
import { isLoggedIn } from "../utils/auth";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

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

  const isClient = user?.role === "client";

  return (
    <div className="p-6 space-y-8">
      {/* Hero / Welcome Section */}
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

      {/* Quick Stats / Action Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start hover:shadow-xl transition">
          <span className="text-blue-500 font-bold text-xl mb-2">
            {isClient ? "5" : "12"}
          </span>
          <p className="text-gray-600 font-medium">
            {isClient ? "Active Projects" : "Proposals Submitted"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start hover:shadow-xl transition">
          <span className="text-green-500 font-bold text-xl mb-2">
            {isClient ? "8" : "3"}
          </span>
          <p className="text-gray-600 font-medium">
            {isClient ? "New Proposals" : "Active Contracts"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start hover:shadow-xl transition">
          <span className="text-yellow-500 font-bold text-xl mb-2">4</span>
          <p className="text-gray-600 font-medium">
            {isClient ? "Pending Contracts" : "Pending Reviews"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start hover:shadow-xl transition">
          <span className="text-purple-500 font-bold text-xl mb-2">7</span>
          <p className="text-gray-600 font-medium">
            {isClient ? "Messages" : "New Messages"}
          </p>
        </div>
      </section>

      {/* Optional Welcome Graphic / Info */}
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
