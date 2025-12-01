// src/pages/NotificationsDropdown.js
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get("/notifications/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [token]);

  const handleClick = async (notif) => {
    try {
      await api.patch(
        `/notifications/${notif.id}/`,
        { unread: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
      );

      if (notif.target_type === "Message") {
        navigate(`/messages/${notif.actor}`);
      } else if (notif.target_type === "Contract") {
        navigate(`/contracts/${notif.target_id}`);
      } else if (notif.target_type === "Proposal") {
        navigate(`/proposals/edit/${notif.target_id}`);
      }
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 p-4 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Notifications
        </h3>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-sm animate-pulse">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3">
        {notifications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-10 animate-pulse">
            No notifications yet.
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              className={`cursor-pointer p-4 rounded-lg shadow-sm border transition-transform transform hover:scale-105 hover:shadow-lg will-change-transform
                ${
                  n.unread
                    ? "bg-teal-100 border-teal-300 dark:bg-teal-200 dark:border-teal-400"
                    : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                }
              `}
            >
              <div className="flex justify-between items-center mb-1">
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  {n.actor_name} {n.verb}
                </p>
                <small className="text-gray-500 dark:text-gray-400 text-xs">
                  {new Date(n.timestamp).toLocaleString()}
                </small>
              </div>
              {n.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  {n.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
