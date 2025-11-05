import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, MessageSquare, AlertCircle } from "lucide-react";
import "./Notifications.css"; // make sure filename matches exactly (case-sensitive)

const NotificationsPanel = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Client approved your proposal",
      message: "Your proposal for the E-commerce UI project was accepted.",
      type: "success",
      isRead: false,
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Payment received ₹2,000",
      message: "Client A has released a payment milestone.",
      type: "payment",
      isRead: true,
      time: "Yesterday",
    },
    {
      id: 3,
      title: "New message from Client B",
      message: "Can we discuss the project timeline?",
      type: "chat",
      isRead: false,
      time: "10 min ago",
    },
    {
      id: 4,
      title: "User disconnected",
      message: "Client C has gone offline.",
      type: "status",
      isRead: true,
      time: "3 hours ago",
    },
  ]);

  // 🔹 Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // 🔹 Mark one notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // 🔹 Filter notifications by active tab
  const filtered = notifications.filter((n) => {
    if (activeTab === "unread") return !n.isRead;
    if (activeTab === "read") return n.isRead;
    return true;
  });

  return (
    <div className="notifications-container">
      <motion.div
        className="notifications-panel"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="notifications-header">
          <h3>
            <Bell size={20} /> Notifications
          </h3>
          <button className="mark-all-btn" onClick={markAllAsRead}>
            MARK ALL AS READ
          </button>
        </div>

        {/* Tabs */}
        <div className="notifications-tabs">
          {["all", "unread", "read"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="notifications-list">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <p className="empty-msg">No {activeTab} notifications</p>
            ) : (
              filtered.map((note) => (
                <motion.div
                  key={note.id}
                  className={`notification-item ${
                    note.isRead ? "read" : "unread"
                  }`}
                  layout
                  onClick={() => markAsRead(note.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="notification-icon">
                    {note.type === "success" && <CheckCircle color="#22c55e" />}
                    {note.type === "chat" && <MessageSquare color="#3b82f6" />}
                    {note.type === "payment" && <AlertCircle color="#f59e0b" />}
                    {note.type === "status" && <AlertCircle color="#9ca3af" />}
                  </div>
                  <div className="notification-content">
                    <strong>{note.title}</strong>
                    <p>{note.message}</p>
                    <span className="time">{note.time}</span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationsPanel;
