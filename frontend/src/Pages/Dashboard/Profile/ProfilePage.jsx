// ProfilePage.jsx
import React from "react";
import styles from "./ProfilePage.module.css"; // Import the CSS module

const ProfilePage = () => {
  return (
    <div className={styles.profilePageContainer}>
      <div className={styles.headerSection}>
        <p className={styles.pageTitle}>Profile</p>
      </div>

      <h3 className={styles.sectionTitle}>Personal Details</h3>
      <div className={styles.inputGroup}>
        <label className={styles.inputLabelContainer}>
          <p className={styles.inputLabel}>Full Name</p>
          <input className={styles.formInput} value="" />
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.inputLabelContainer}>
          <p className={styles.inputLabel}>Date of Birth</p>
          <input className={styles.formInput} value="" />
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.inputLabelContainer}>
          <p className={styles.inputLabel}>Gender</p>
          <input className={styles.formInput} value="" />
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.inputLabelContainer}>
          <p className={styles.inputLabel}>Nationality</p>
          <input className={styles.formInput} value="" />
        </label>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.editButton}>
          <span className={styles.buttonText}>Edit Personal Details</span>
        </button>
      </div>

      <h3 className={styles.sectionTitle}>Contact Information</h3>
      <div className={styles.inputGroup}>
        <label className={styles.inputLabelContainer}>
          <p className={styles.inputLabel}>Email</p>
          <input className={styles.formInput} value="" />
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.inputLabelContainer}>
          <p className={styles.inputLabel}>Phone Number</p>
          <input className={styles.formInput} value="" />
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.inputLabelContainer}>
          <p className={styles.inputLabel}>Address</p>
          <input className={styles.formInput} value="" />
        </label>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.editButton}>
          <span className={styles.buttonText}>Edit Contact Information</span>
        </button>
      </div>

      <h3 className={styles.sectionTitle}>Membership Details</h3>
      <div className={styles.inputGroup}>
        <label className={styles.inputLabelContainer}>
          <p className={styles.inputLabel}>Membership Type</p>
          <input className={styles.formInput} value="" />
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.inputLabelContainer}>
          <p className={styles.inputLabel}>Membership ID</p>
          <input className={styles.formInput} value="" />
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.inputLabelContainer}>
          <p className={styles.inputLabel}>Expiry Date</p>
          <input className={styles.formInput} value="" />
        </label>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.editButton}>
          <span className={styles.buttonText}>Edit Membership Details</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
