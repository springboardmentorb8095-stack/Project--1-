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
        prev.map((n) =>
          n.id === notif.id ? { ...n, unread: false } : n
        )
      );

      // navigate to target
      if (notif.target_type === "Message") {
        navigate(`/messages/${notif.actor}`);
      } else if (notif.target_type === "Contract") {
        navigate(`/contracts/${notif.target_id}`);
      }
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Notifications
        </h3>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-sm">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet.</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              className={`cursor-pointer p-3 rounded-lg shadow-sm border ${
                n.unread
                  ? "bg-teal-100 border-teal-300"
                  : "bg-white border-gray-200"
              } hover:bg-gray-100 transition`}
            >
              <div className="flex justify-between items-center">
                <p className="text-gray-800 font-medium">
                  {n.actor_name} {n.verb}
                </p>
                <small className="text-gray-500 text-xs">
                  {new Date(n.timestamp).toLocaleString()}
                </small>
              </div>
              {n.description && (
                <p className="text-gray-600 text-sm mt-1">{n.description}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
