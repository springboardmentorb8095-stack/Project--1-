import React, { useEffect, useState } from "react";
import "./Auth.css";

function MyProfile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // localStorage me se user ka data lana
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserData(storedUser);
    }
  }, []);

  if (!userData) {
    return (
      <div className="auth-container">
        <h2>⚠️ No Profile Found</h2>
        <p>Please register or update your profile first.</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>👤 My Profile</h2>
      <div className="auth-form">
        <p><strong>Username:</strong> {userData.username || "N/A"}</p>
        <p><strong>Email:</strong> {userData.email || "N/A"}</p>
        <p><strong>Role:</strong> {userData.role || "N/A"}</p>
      </div>
    </div>
  );
}

export default MyProfile;
