import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/NavigationBar.module.css";

// 🆕 Import Theme Toggle
import ThemeToggle from "../theme/ThemeToggle";

function NavigationBar() {
  const navigate = useNavigate();

  const [isFreelancer, setIsFreelancer] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setIsFreelancer(localStorage.getItem("is_freelancer") === "true");
    fetchUnreadNotifications();
  }, []);

  // 🛎️ Fetch unread notifications count
  const fetchUnreadNotifications = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://127.0.0.1:8000/api/accounts/notifications/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const unread = data.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("is_freelancer");
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      {/* Left side: Title */}
      <h2 className={styles.navTitle}>{isFreelancer ? "Freelancer" : "Client"} Menu</h2>

      {/* Center: Links */}
      <div className={styles.navLinks}>
        <Link
          to={isFreelancer ? "/freelancerdashboard" : "/dashboard"}
          className={`${styles.navLink} ${styles.dashboardBtn}`}
        >
          🏠 Dashboard
        </Link>

        <Link
          to={isFreelancer ? "/freelancer/profile" : "/client/profile"}
          className={`${styles.navLink} ${styles.profileBtn}`}
        >
        👤 Profile
        </Link>

        {isFreelancer ? (
          <Link
            to="/find-projects"
            className={`${styles.navLink} ${styles.findProjectsBtn}`}
          >
            🔍 Find Projects
          </Link>
        ) : (
          <Link
            to="/find-freelancers"
            className={`${styles.navLink} ${styles.findProjectsBtn}`}
          >
            👩‍💻 Find Freelancers
          </Link>
        )}

        <Link
          to="/contracts"
          className={`${styles.navLink} ${styles.contractsBtn}`}
        >
          📜 Contracts
        </Link>

        <Link
          to="/messages"
          className={`${styles.navLink} ${styles.messagesBtn}`}
        >
          💬 Messages
        </Link>

        {/* 🛎️ Notifications Link */}
        <Link
          to="/notifications"
          className={`${styles.navLink} ${styles.notificationsBtn}`}
        >
          🔔 Notifications
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount}</span>
          )}
        </Link>
      </div>

      {/* Right side: Theme toggle + Logout */}
      <div className={styles.navRight}>
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className={`${styles.navButton} ${styles.logoutBtn}`}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavigationBar;
