import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const token = localStorage.getItem('access');

useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  if (token) {
    fetchNotifications();
  }
}, [token]); // ✅ No ESLint warning now


  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`/notifications/${id}/`, { is_read: true }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  return (
    <div className="notification-bell-wrapper">
      <style>{`
        .notification-bell-wrapper {
          position: relative;
          display: inline-block;
        }

        .notification-bell {
          cursor: pointer;
          font-size: 1.2rem;
          color: #fff;
          position: relative;
        }

        .unread-count {
          background-color: red;
          color: white;
          font-size: 0.75rem;
          padding: 2px 6px;
          border-radius: 50%;
          position: absolute;
          top: -8px;
          right: -10px;
        }

        .notification-dropdown {
          position: absolute;
          top: 30px;
          right: 0;
          background-color: #fff;
          color: #333;
          width: 300px;
          max-height: 400px;
          overflow-y: auto;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          border-radius: 6px;
          z-index: 1000;
        }

        .notification-item {
          padding: 10px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
        }

        .notification-item.unread {
          background-color: #f9f9f9;
          font-weight: 500;
        }

        .notification-item.read {
          background-color: #fff;
          color: #888;
        }

        .notification-item:hover {
          background-color: #f0f0f0;
        }

        .empty {
          padding: 10px;
          text-align: center;
          color: #666;
        }
      `}</style>

      <div className="notification-bell" onClick={handleToggleDropdown}>
        🔔 <span className="unread-count">{unreadCount}</span>
      </div>

      {showDropdown && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <p className="empty">No notifications</p>
          ) : (
            notifications.map((note) => (
              <div
                key={note.id}
                className={`notification-item ${note.is_read ? 'read' : 'unread'}`}
                onClick={() => handleMarkAsRead(note.id)}
              >
                <p>{note.message}</p>
                <span>{new Date(note.created_at).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
