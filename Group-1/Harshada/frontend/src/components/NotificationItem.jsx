import React from "react";

const NotificationItem = ({ notif, onMarkAsRead }) => {
  const handleClick = () => {
    if (!notif.is_read && onMarkAsRead) onMarkAsRead(notif.id);
    if (notif.url) window.location.href = notif.url;
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    if (isNaN(date)) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col rounded-xl px-4 py-3 mb-2 transition-all cursor-pointer ${
        notif.is_read ? "bg-gray-50 hover:bg-gray-100" : "bg-blue-50 hover:bg-blue-100"
      }`}
    >
      <div className="flex justify-between items-start">
        <p
          className={`text-sm ${
            notif.is_read ? "font-medium text-gray-700" : "font-semibold text-gray-900"
          }`}
        >
          {notif.message}
        </p>
        <small className="text-gray-400 ml-2">{formatTime(notif.created_at)}</small>
      </div>
      {notif.from_user && (
        <small className="text-xs text-gray-500 mt-1">From: {notif.from_user}</small>
      )}
    </div>
  );
};

export default NotificationItem;
