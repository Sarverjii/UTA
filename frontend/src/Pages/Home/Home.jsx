import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import ListItem from "../../Components/ListItem.jsx/ListItem";

// Import icons from react-icons
import {
  FaUser,
  FaChalkboardTeacher,
  FaBuilding,
  FaMapMarkerAlt,
  FaEnvelope, // Added for email icon
  FaBriefcase, // Added for position icon
  FaUserCircle, // Added for a generic person icon
} from "react-icons/fa"; // Make sure to import the new icons

const Home = () => {
  // Data for Key Personnel
  const keyPersonnel = [
    {
      name: "Arjun Sharma",
      position: "President",
      contact: "arjun.sharma@uta.org",
    },
    {
      name: "Priya Verma",
      position: "Secretary",
      contact: "priya.verma@uta.org",
    },
    {
      name: "Rohan Kapoor",
      position: "Treasurer",
      contact: "rohan.kapoor@uta.org",
    },
  ];

  return (
    <div>
      <main>
        <div className={styles.homeBanner}>
          <h1>Welcome to Uttranchal Tennis Association</h1>
          <p>Promoting tennis excellence in the heart of the Himalayas.</p>
          <Link to="/tournaments">Explore Tournaments</Link>
        </div>

        <section className={styles.upcomingEvents}>
          <div className={styles.upcomingEventsHeader}>
            <h2>Upcoming Events</h2>
          </div>
          <div className={styles.upcomingEventsListContainer}>
            {""}
            <ListItem
              heading="Nissan All India Open Seniors Tennis Tournament 2024"
              description="A special Tennis Tournament only for seniors"
              imageurl="./img2.jpg"
            />
            <ListItem
              heading="Nissan All India Open Seniors Tennis Tournament 2024"
              description="A special Tennis Tournament only for seniors"
              imageurl="./img2.jpg"
            />
            <ListItem
              heading="Nissan All India Open Seniors Tennis Tournament 2024"
              description="A special Tennis Tournament only for seniors"
              imageurl="./img2.jpg"
            />
          </div>
        </section>

        {/* New Section: Home Grid Section */}
        <section className={styles.homeGridSection}>
          <h2 className={styles.homeGridSectionTitle}>Join Our Community</h2>{" "}
          <div className={styles.gridContainer}>
            <div className={styles.gridItem}>
              <FaUser className={styles.gridIcon} />
              <h3>Players</h3>
              <p>Become a member and compete in a tournament</p>
            </div>
            <div className={styles.gridItem}>
              <FaChalkboardTeacher className={styles.gridIcon} />
              <h3>Coaches</h3>
              <p>Get Certified and coach aspiring players</p>
            </div>
            <div className={styles.gridItem}>
              <FaBuilding className={styles.gridIcon} />
              <h3>Academies</h3>
              <p>Affiliate your Academy with us</p>
            </div>
            <div className={styles.gridItem}>
              <FaMapMarkerAlt className={styles.gridIcon} />
              <h3>Districts</h3>
              <p>Represent your District in state events</p>
            </div>
          </div>
          <Link to="/join-us">Join Us Now</Link>{" "}
        </section>

        {/* REPLACED: Key Personnel Section (from Table to Cards) */}
        <section className={styles.keyPersonnelSection}>
          <h2 className={styles.keyPersonnelTitle}>Key Personnel</h2>
          <div className={styles.personnelCardsContainer}>
            {" "}
            {/* New container for cards */}
            {keyPersonnel.map((person, index) => (
              <div key={index} className={styles.personnelCard}>
                {" "}
                {/* Individual card */}
                <FaUserCircle className={styles.personnelIcon} />{" "}
                {/* Icon for person */}
                <h3>{person.name}</h3>
                <p className={styles.personnelPosition}>
                  <FaBriefcase className={styles.detailIcon} />{" "}
                  {person.position}
                </p>
                <p className={styles.personnelContact}>
                  <FaEnvelope className={styles.detailIcon} />{" "}
                  <a href={`mailto:${person.contact}`}>{person.contact}</a>
                </p>
              </div>
            ))}
          </div>
        </section>
        {/* END REPLACED SECTION */}
      </main>
    </div>
  );
};

export default Home;
