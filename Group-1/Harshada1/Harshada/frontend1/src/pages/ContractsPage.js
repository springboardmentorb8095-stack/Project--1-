import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Wallet,
  User,
  Calendar,
  MessageSquare,
  X,
} from "lucide-react";

const ContractsPage = () => {
  const [selectedContract, setSelectedContract] = useState(null);
  const [chatContract, setChatContract] = useState(null);

  // Example contracts — replace with API data
  const contracts = [
    {
      id: 1,
      title: "UI/UX Design for Mobile App",
      status: "Active",
      bidAmount: 20000,
      client: "Harshada",
      freelancer: "Rohan",
      created: "2025-10-24",
      description:
        "Design a modern and visually appealing UI/UX for a cross-platform app using Figma and interactive prototypes.",
    },
    {
      id: 2,
      title: "Backend API Integration",
      status: "In Review",
      bidAmount: 15000,
      client: "Harshada",
      freelancer: "Aman",
      created: "2025-10-20",
      description:
        "Integrate and optimize Django REST APIs for fast communication and smooth user experience.",
    },
    {
      id: 3,
      title: "Portfolio Website",
      status: "Completed",
      bidAmount: 12000,
      client: "Harshada",
      freelancer: "Neha",
      created: "2025-09-15",
      description:
        "Develop a responsive personal portfolio using React, Framer Motion, and TailwindCSS.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16 flex flex-col items-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent drop-shadow-md">
          My Contracts
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Manage, view, and chat within your freelance contracts 🌟
        </p>
      </motion.div>

      {/* Contract Cards */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl px-6 place-items-center">
        {contracts.map((contract, i) => (
          <motion.div
            key={contract.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="w-[320px] md:w-[340px] bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-purple-100 hover:shadow-2xl transition-all p-6 relative overflow-hidden"
          >
            {/* Glow background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 to-pink-100/20 opacity-0 hover:opacity-100 transition-opacity rounded-3xl"></div>

            <div className="relative z-10">
              {/* Title */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="text-purple-500" size={20} />
                  <h2 className="font-semibold text-lg text-gray-800">
                    {contract.title}
                  </h2>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    contract.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : contract.status === "In Review"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {contract.status}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2 text-gray-700 text-sm">
                <p className="flex items-center gap-2">
                  <Wallet className="text-yellow-500" size={16} />
                  <b>Bid:</b> ₹{contract.bidAmount.toLocaleString()}
                </p>
                <p className="flex items-center gap-2">
                  <User className="text-indigo-500" size={16} />
                  <b>Client:</b> {contract.client}
                </p>
                <p className="flex items-center gap-2">
                  <User className="text-pink-500" size={16} />
                  <b>Freelancer:</b> {contract.freelancer}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="text-orange-400" size={16} />
                  <b>Created:</b>{" "}
                  {new Date(contract.created).toLocaleDateString()}
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-between gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedContract(contract)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  View Details
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setChatContract(contract)}
                  className="flex-1 py-2.5 border border-purple-300 text-purple-600 rounded-xl font-medium hover:bg-purple-50 flex items-center justify-center gap-1 transition-all"
                >
                  <MessageSquare size={16} /> Message
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View Details Modal */}
      <AnimatePresence>
        {selectedContract && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative"
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedContract(null)}
              >
                <X size={22} />
              </button>

              <h2 className="text-2xl font-bold text-purple-600 mb-4">
                {selectedContract.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {selectedContract.description}
              </p>

              <div className="space-y-2 text-gray-700">
                <p><b>Status:</b> {selectedContract.status}</p>
                <p><b>Bid:</b> ₹{selectedContract.bidAmount.toLocaleString()}</p>
                <p><b>Client:</b> {selectedContract.client}</p>
                <p><b>Freelancer:</b> {selectedContract.freelancer}</p>
                <p>
                  <b>Created:</b>{" "}
                  {new Date(selectedContract.created).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {chatContract && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              exit={{ y: 60 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative"
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setChatContract(null)}
              >
                <X size={22} />
              </button>

              <h3 className="text-2xl font-semibold text-purple-600 mb-4">
                Chat with {chatContract.freelancer}
              </h3>

              <div className="bg-gray-50 rounded-xl h-64 overflow-y-auto p-4 border border-gray-200 mb-4">
                <p className="text-gray-500 text-sm text-center mt-24">
                  💬 Start a conversation with {chatContract.freelancer}
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                  Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContractsPage;
