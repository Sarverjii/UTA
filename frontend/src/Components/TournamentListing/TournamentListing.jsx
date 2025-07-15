import React from "react";
import styles from "./TournamentListing.module.css";

const TournamentListing = ({ name, city, date }) => {
  return (
    <div className={styles.tournamentListing}>
      <div className={styles.tournamentDetails}>
        <h2>{name}</h2>
        {/* COMBINED CITY AND DATE INTO ONE PARAGRAPH */}
        <p>
          {city}, {date}
        </p>
      </div>
      <button className={styles.registerButton}>Register</button>
    </div>
  );
};

export default TournamentListing;
