// Dashboard.jsx
import React from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import ProfilePage from "./Profile/ProfilePage"; // Or any other page component
import styles from "./Dashboard.module.css"; // Import the CSS module

const Dashboard = () => {
  return (
    <div className={styles.dashboardRoot}>
      <div className={styles.layoutContainer}>
        {/* The Sidebar component is now responsible for its own positioning */}
        <Sidebar />

        {/* The main content area */}
        <div className={styles.mainContentArea}>
          <ProfilePage />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
