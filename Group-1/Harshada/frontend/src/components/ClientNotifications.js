// src/components/ClientNotifications.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, MessageSquare, Star } from "lucide-react";
import "./Notifications.css";

const clientNotifications = [
  {
    id: 1,
    title: "New proposal received",
    message: "Freelancer A applied for your project 'E-commerce UI'.",
    type: "proposal",
    time: "5 min ago",
  },
  {
    id: 2,
    title: "Milestone payment requested ₹2,000",
    message: "Freelancer B requested payment for milestone #1.",
    type: "payment",
    time: "1 hour ago",
  },
  {
    id: 3,
    title: "Freelancer accepted your contract",
    message: "Freelancer C accepted the contract for 'Landing Page Design'.",
    type: "contract",
    time: "Yesterday",
  },
  {
    id: 4,
    title: "Project completed 🎉",
    message: "Freelancer D completed 'Logo Design Project'.",
    type: "completed",
    time: "2 days ago",
  },
  {
    id: 5,
    title: "Rating pending",
    message: "Please rate Freelancer E for 'Portfolio Website'.",
    type: "rating",
    time: "2 days ago",
  },
];

const ClientNotifications = () => {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <motion.div
      className="notifications-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="notifications-header">
        <h2>🔔 Notifications</h2>
        <button className="mark-all">MARK ALL AS READ</button>
      </div>

      <div className="tabs">
        {["all", "unread", "read"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="notifications-list">
        <AnimatePresence>
          {clientNotifications.map((n) => (
            <motion.div
              key={n.id}
              className="notification-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="notification-icon">
                {n.type === "proposal" && <CheckCircle color="#4caf50" />}
                {n.type === "payment" && <AlertCircle color="#ff9800" />}
                {n.type === "contract" && <CheckCircle color="#2196f3" />}
                {n.type === "completed" && <CheckCircle color="#673ab7" />}
                {n.type === "rating" && <Star color="#ffb400" />}
              </div>
              <div className="notification-content">
                <h4>{n.title}</h4>
                <p>{n.message}</p>
                <span className="time">{n.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ClientNotifications;
