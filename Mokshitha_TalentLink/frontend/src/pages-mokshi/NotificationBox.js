import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./NotificationBox.css";
import { Bell } from "lucide-react";

export default function NotificationBox() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const username =
    localStorage.getItem("profileName") ||
    localStorage.getItem("freelancerProfileName") ||
    localStorage.getItem("clientProfileName");

  // ✅ Fetch unread notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/notifications/");
      const filtered = res.data.filter(
        (n) => n.user_name === username && !n.is_read
      );
      setNotifications(filtered);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [username]);

  // ✅ Mark as read + redirect to chat
  const handleView = async (e, link, id) => {
  e.preventDefault();

  try {
    // ✅ Mark notification as read
    await axios.patch(`http://127.0.0.1:8000/api/notifications/${id}/`, {
      is_read: true,
    });

    // ✅ Immediately update UI
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    // ✅ Redirect to link
    if (link) window.location.href = link;
  } catch (err) {
    console.error("Error marking notification as read:", err);
  }
};

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef}>
      <div
        className="notification-bell"
        onClick={() => setOpen(!open)}
        title="Notifications"
      >
        <Bell />
        {notifications.length > 0 && <span className="notification-dot"></span>}
      </div>

      {open && (
        <div className="notification-dropdown">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <p key={n.id}>
                {n.message}{" "}
                <a href="#" onClick={(e) => handleView(e,n.link,n.id)}>
                  View
                </a>
              </p>
            ))
          ) : (
            <p>No new notifications</p>
          )}
        </div>
      )}
    </div>
  );
}
