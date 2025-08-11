// Home.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Home.module.css"; // Import CSS module

export default function Home() {
  const [events, setEvents] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu

  // Function to fetch events from the backend
  const getEvents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/events/`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching events:", error);
    }
  };

  // Function for smooth scrolling
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false); // Close mobile menu after clicking a link
  };

  // Effect hook to fetch events on component mount and scroll to top
  useEffect(() => {
    getEvents();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.homeContainer}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.headerLogoGroup}>
          {/* Logo SVG */}
          <div className={styles.logoIcon}>
            <img src="/logo.png" alt="UTA LOGO" />
          </div>
          <h2 className={styles.headerTitle}>Uttranchal Tennis Association</h2>
        </div>
        <div className={styles.headerNavActions}>
          {/* Navigation Links */}
          <div className={styles.navbarNav}>
            <a
              className={styles.navLink}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("top");
              }}
            >
              Home
            </a>
            <a
              className={styles.navLink}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("eventDetails");
              }}
            >
              Events
            </a>
            <a
              className={styles.navLink}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contactInfo");
              }}
            >
              Contact
            </a>
            <a className={styles.navLink} href="/Nissan/registered-players">
              Registered Players
            </a>
          </div>
          {/* Action Buttons */}
          <div className={styles.headerButtons}>
            <Link
              to="/Nissan/register" // Assuming a registration route
              className={styles.registerButton}
            >
              <span className={styles.buttonText}>Register Now</span>
            </Link>
            <Link
              to="/Nissan/login" // Assuming a login route
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
          <a
            className={styles.navLink}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("top");
            }}
          >
            Home
          </a>
          {/* <a className={styles.navLink} href="#" onClick={() => scrollToSection("aboutSectionId")}>About</a> */}
          <a
            className={styles.navLink}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("eventDetails");
            }}
          >
            Events
          </a>
          <a
            className={styles.navLink}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contactInfo");
            }}
          >
            Contact
          </a>
          <a className={styles.navLink} href="/Nissan/registered-players">
            Registered Players
          </a>
        </div>
        <div className={styles.mobileNavButtons}>
          <Link
            to="/Nissan/register"
            className={styles.registerButton}
            onClick={() => setMobileMenuOpen(false)} // Close menu on navigation
          >
            <span className={styles.buttonText}>Register Now</span>
          </Link>
          <Link
            to="/Nissan/login"
            className={styles.loginButton}
            onClick={() => setMobileMenuOpen(false)} // Close menu on navigation
          >
            <span className={styles.buttonText}>Login</span>
          </Link>
        </div>
      </div>

      {/* Main Content Sections (Tiles) */}
      <main className={styles.mainContent}>
        {/* Banner Section */}
        <section className={styles.bannerSection} id="top">
          {" "}
          {/* Added id="top" for Home link */}
          <div className={styles.bannerContainer}>
            <div className={styles.bannerPadding}>
              <div
                className={styles.bannerContent}
                style={{
                  backgroundImage: `url('/banner.webp')`, // Correct path for banner image
                }}
              >
                <div className={styles.bannerOverlay}></div>{" "}
                {/* Added for dark overlay */}
                <div className={styles.bannerTextGroup}>
                  <h1 className={styles.bannerTitle}>
                    Nissan All India Open Seniors Tennis Tournament 2024,
                    Dehradun
                  </h1>
                  <h2 className={styles.bannerSubtitle}>
                    Join us for an exciting tournament in the heart of Dehradun!
                  </h2>
                </div>
                <div className={styles.bannerButtons}>
                  <Link to="/Nissan/register" className={styles.registerButton}>
                    <span className={styles.buttonText}>Register Now</span>
                  </Link>
                  <Link to="/Nissan/login" className={styles.loginButton}>
                    <span className={styles.buttonText}>Login</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tournament Details Section */}
        <section className={styles.section} id="eventDetails">
          {" "}
          {/* Added id="eventDetails" for Events link */}
          <h2 className={styles.sectionTitle}>Tournament Details</h2>
          <div className={styles.gridContainer}>
            {/* Categories And Format Tile */}
            <div className={styles.tile}>
              <h3 className={styles.tileTitle}>Categories And Format</h3>
              <div className={styles.tileContent}>
                <h4 className={styles.tileSubtitle}>Tournament Categories</h4>
                <ul className={styles.tileList}>
                  {events.length > 0 ? (
                    events.map((event) => <li key={event._id}>{event.name}</li>)
                  ) : (
                    <li>No categories available.</li>
                  )}
                </ul>
                <h4 className={styles.tileSubtitle}>Lucky Doubles Format:</h4>
                <p className={styles.tileParagraph}>
                  Any participant who loses both matches in the first round or
                  loses in the first round of a single event will be eligible.
                </p>
                <h5 className={styles.tileSmallHeading}>Pairing Logic:</h5>
                <ul className={styles.tileList}>
                  <li>
                    Participants divided into X (Age $\leq$ 50) and Y (Age {">"}
                    50) categories
                  </li>
                  <li>
                    Each pair will have one person from X and one from Y based
                    on lottery system
                  </li>
                </ul>
              </div>
            </div>

            {/* Entry & Participation Tile */}
            <div className={styles.tile}>
              <h3 className={styles.tileTitle}>Entry & Participation</h3>
              <div className={styles.tileContent}>
                <h4 className={styles.tileSubtitle}>Entry Rules:</h4>
                <ul className={styles.tileList}>
                  <li>
                    One player can participate in max 2 categories (excluding
                    Lucky Doubles)
                  </li>
                  <li>Coaches are allowed to play in Category A only</li>
                  <li>Maximum draw size in any category is 32</li>
                  <li>Please carry age proof with you</li>
                </ul>
                <h4 className={styles.tileSubtitle}>Entry Fees</h4>
                <p className={styles.tileParagraph}>Two events: ₹4,500</p>
                <p className={styles.tileParagraph}>
                  Two events with accommodation: ₹6,000 (double sharing up to 2
                  days)
                </p>
                <p className={styles.tileParagraph}>One event: ₹3,000</p>
                <p className={styles.tileParagraphLast}>
                  One event with accommodation: ₹4,500 (double sharing up to 2
                  days)
                </p>
                <h5 className={styles.tileImportantDate}>
                  Last date for entry fees: December 7, 2024
                </h5>
              </div>
            </div>
          </div>
        </section>

        {/* Prizes & Benefits Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Prizes & Benefits</h2>
          <div className={styles.gridContainer}>
            {/* Prize Money Tile */}
            <div className={styles.tile}>
              <h3 className={styles.tileTitle}>Prize Money</h3>
              <ul className={styles.tileList}>
                <li>Winner team: ₹21,000</li>
                <li>Runners-up team: ₹11,000</li>
                <li>Semi-Finalist teams: ₹4,000 each</li>
                <li>Lucky Doubles: 50% of regular prizes</li>
              </ul>
            </div>
            {/* Participant Benefits Tile */}
            <div className={styles.tile}>
              <h3 className={styles.tileTitle}>Participant Benefits</h3>
              <ul className={styles.tileList}>
                <li>Breakfast and Lunch on both days</li>
                <li>Gala dinner on December 9</li>
                <li>
                  Every participant receives Indian Tree T-Shirt, Shorts, Socks,
                  Cap, Wristband (MRP more than ₹3,000)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Venue & Important Information Section */}
        <section className={styles.section} id="contactInfo">
          {" "}
          {/* Added id="contactInfo" for Contact link */}
          <h2 className={styles.sectionTitle}>Venue & Important Information</h2>
          <div className={styles.gridContainerMaps}>
            {/* Tournament Venue Tile */}
            <div className={styles.tile}>
              <h3 className={styles.tileTitle}>Tournament Venue:</h3>
              <h2>Shanti Tennis Academy, Dehradun</h2>
              <p className={styles.tileParagraph}>
                4 hard courts + 4 additional hard courts at nearby venue if
                required
              </p>
              <div className={styles.mapContainer}>
                {/* Corrected Google Maps Embed for Shanti Tennis Academy */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4144.13129430105!2d78.0512385762313!3d30.309067774791345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929af78d571c3%3A0xce2d2329a1ca3d38!2sShanti%20Tennis%20Academy!5e1!3m2!1sen!2sin!4v1750927295337!5m2!1sen!2sin"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className={styles.mapFrame}
                ></iframe>
              </div>
            </div>
            {/* Gala Party & Stay Tile */}
            <div className={styles.tile}>
              <h3 className={styles.tileTitle}>Gala Party & Stay</h3>
              <h2>Om Farms</h2>
              <p className={styles.tileParagraph}>
                8-A, Jogiwala, Badripur, Dehradun
              </p>
              <div className={styles.mapContainer}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4145.237671631134!2d78.0583008873412!3d30.282890209839486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39092959191d4435%3A0x4fe509851fb5806b!2sOM%20farms!5e1!3m2!1sen!2sin!4v1750927278537!5m2!1sen!2sin"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className={styles.mapFrame}
                ></iframe>
              </div>
            </div>
          </div>
          {/* Important Information Tile - Moved to span full width */}
          <div className={`${styles.tile} ${styles.fullWidthTile}`}>
            <h3 className={styles.tileTitle}>Important Information</h3>
            <ul className={styles.tileList}>
              <li>Draws and Order of Play published on December 8</li>
              <li>
                Walk-over given if team doesn't appear within 15 minutes of
                scheduled time
              </li>
              <li>Tournament balls: Head Tour</li>
              <li>
                For queries contact{" "}
                <b>Tournament Director: Sumit Goel (Ph. 9412977857)</b>
              </li>
            </ul>
          </div>
        </section>

        {/* Ready to Participate Section */}
        <section className={`${styles.ctaSection} ${styles.fullWidthCta}`}>
          <h2 className={styles.sectionTitle}>Ready to Participate?</h2>
          <p className={styles.ctaParagraph}>
            Join us for an exciting tennis tournament with great prizes and
            networking opportunities!
          </p>
          <div className={styles.ctaButtons}>
            <Link to="/Nissan/register" className={styles.registerButtonCta}>
              <span className={styles.buttonText}>Register Now</span>
            </Link>
            <Link
              to="/Nissan/registered-players"
              className={styles.loginButtonCta}
            >
              <span className={styles.buttonText}>Registered Players</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} Uttranchal Tennis Association. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
