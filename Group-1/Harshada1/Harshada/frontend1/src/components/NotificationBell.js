// src/components/NotificationBell.js
import React, { useState } from "react";
import { Bell } from "lucide-react";
import NotificationsPanel from "./NotificationsPanel";
import "./Notifications.css";

export default function NotificationBell({ notifications, onMarkAsRead, onMarkAllRead }) {
  const [open, setOpen] = useState(false);

  // ✅ CRITICAL FIX: Use 'is_read' for consistency and correct count
  const unreadCount = notifications.filter((n) => !n.is_read).length; 

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer relative flex items-center"
      >
        <Bell size={22} color="#374151" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>

      {open && (
        <NotificationsPanel
          notifications={notifications}
          onMarkAsRead={onMarkAsRead}
          onMarkAllRead={onMarkAllRead}
          onClose={() => setOpen(false)} // Pass close function
        />
      )}
    </div>
  );
}