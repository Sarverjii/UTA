import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLogoGroup}>
          {/* Logo SVG */}
          <div className={styles.logoIcon}>
            <img src="/logo.png" alt="UTA LOGO" />
            <h2 className={styles.headerTitle}>
              Uttranchal Tennis Association
            </h2>
          </div>
        </div>
        <div className={styles.headerNavActions}>
          {/* Navigation Links */}
          <div className={styles.navbarNav}>
            <Link to="/">Home</Link>
            <Link to="/tournament">Tournaments</Link>
            <Link to="/about">About Us</Link>
            <Link to="/joinUs">Join Us</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
          {/* Action Buttons */}
          <div className={styles.headerButtons}>
            <Link
              to="/login" // Assuming a login route
              className={styles.loginButton}
            >
              <span className={styles.buttonText}>Login</span>
            </Link>
          </div>
        </div>
        {/* Mobile menu icon */}
        <div className={styles.mobileMenuIcon}>
          <button
            className={styles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className={styles.mobileMenuSvg}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={`${styles.mobileNavOverlay} ${
          mobileMenuOpen ? styles.mobileNavOpen : ""
        }`}
      >
        <div className={styles.mobileNavHeader}>
          <h2 className={styles.headerTitle}>Uttranchal Tennis Association</h2>
          <button
            className={styles.mobileCloseButton}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg
              className={styles.mobileMenuSvg}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className={styles.mobileNavLinks}>
          <Link className={styles.navLink} to="/">
            Home
          </Link>
          <Link className={styles.navLink} to="/tournament">
            Tournaments
          </Link>
          <Link className={styles.navLink} to="/about">
            About Us
          </Link>
          <Link className={styles.navLink} to="/joinUs">
            Join Us
          </Link>
          <Link className={styles.navLink} to="/contact">
            Contact Us
          </Link>
        </div>
        <div className={styles.mobileNavButtons}>
          <Link
            to="/login"
            className={styles.loginButton}
            onClick={() => setMobileMenuOpen(false)} // Close menu on navigation
          >
            <span className={styles.buttonText}>Login</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
