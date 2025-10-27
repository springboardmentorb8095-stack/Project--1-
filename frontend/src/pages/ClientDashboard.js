import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ClientDashboard() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem("clientProjects")) || [];
    setProjects(savedProjects);
  }, []);

  // Summary stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "Active").length;
  const completedProjects = projects.filter((p) => p.status === "Completed").length;

  // Create Contract
  const createContract = (project) => {
    const contracts = JSON.parse(localStorage.getItem("contracts")) || [];
    const newContract = {
      id: Date.now(),
      projectTitle: project.title,
      client: JSON.parse(localStorage.getItem("user")).username,
      freelancer: project.acceptedFreelancer || "Not Assigned",
      status: "Pending",
      createdAt: new Date().toLocaleString(),
    };
    contracts.push(newContract);
    localStorage.setItem("contracts", JSON.stringify(contracts));
    alert(`Contract for "${project.title}" created!`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📊 Client Dashboard</h2>
        <button
          onClick={() => navigate("/post-project")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition-colors"
        >
          ➕ Create Project
        </button>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap gap-6 mb-8">
        <div className="flex-1 bg-blue-50 text-blue-800 p-6 rounded-xl shadow hover:shadow-lg transition-shadow text-center">
          <h3 className="text-lg font-medium mb-2">Total Projects</h3>
          <p className="text-3xl font-bold">{totalProjects}</p>
        </div>
        <div className="flex-1 bg-green-50 text-green-800 p-6 rounded-xl shadow hover:shadow-lg transition-shadow text-center">
          <h3 className="text-lg font-medium mb-2">Active Projects</h3>
          <p className="text-3xl font-bold">{activeProjects}</p>
        </div>
        <div className="flex-1 bg-yellow-50 text-yellow-800 p-6 rounded-xl shadow hover:shadow-lg transition-shadow text-center">
          <h3 className="text-lg font-medium mb-2">Completed Projects</h3>
          <p className="text-3xl font-bold">{completedProjects}</p>
        </div>
      </div>

      {/* Project List */}
      <h3 className="text-xl font-semibold mb-4">🗂️ My Projects</h3>
      {projects.length === 0 ? (
        <p className="text-gray-500">You haven't posted any project yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow hover:shadow-lg transition-shadow flex justify-between items-start"
            >
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-1">{project.title}</h4>
                <p className="text-gray-700 dark:text-gray-300">💰 Budget: {project.budget}</p>
                <p className="text-gray-700 dark:text-gray-300">🧠 Skills: {project.skills}</p>
                <p className="text-gray-700 dark:text-gray-300">📅 Deadline: {project.deadline}</p>
                <p className="text-gray-700 dark:text-gray-300">
                  📌 Status: <span className="font-bold">{project.status}</span>
                </p>
                {project.acceptedFreelancer && (
                  <p className="text-green-600 dark:text-green-400">✅ Accepted by: {project.acceptedFreelancer}</p>
                )}
              </div>
              {project.acceptedFreelancer && (
                <button
                  onClick={() => createContract(project)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition-colors self-start"
                >
                  ✒️ Create Contract
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientDashboard;
