import React, { useState } from "react";
import styles from "./Tournaments.module.css"; // Styles for the main page layout
import { Link } from "react-router-dom"; // Assuming you're using react-router-dom
import TournamentListing from "../../Components/TournamentListing/TournamentListing"; // Path to your TournamentListing component
import { FaSearch } from "react-icons/fa"; // Importing search icon

// Mock data to simulate tournaments grouped by month
const tournamentsData = [
  {
    month: "July 2024",
    events: [
      { name: "Uttarakhand Open", city: "Dehradun", date: "July 15-20, 2024" },
    ],
  },
  {
    month: "August 2024",
    events: [
      {
        name: "Junior Championship",
        city: "Nainital",
        date: "August 5-10, 2024",
      },
    ],
  },
  {
    month: "September 2024",
    events: [
      { name: "Veteran's Cup", city: "Haridwar", date: "September 2-7, 2024" },
    ],
  },
  {
    month: "October 2024",
    events: [
      {
        name: "Inter-Club League",
        city: "Rishikesh",
        date: "October 14-19, 2024",
      },
    ],
  },
  {
    month: "November 2024",
    events: [
      {
        name: "State Masters",
        city: "Mussoorie",
        date: "November 11-16, 2024",
      },
    ],
  },
];

const Tournaments = () => {
  // State for active filter (e.g., "All", "Upcoming", "Past")
  const [activeFilter, setActiveFilter] = useState("Upcoming"); // Default to "Upcoming"

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter tournaments based on activeFilter and searchTerm
  const filteredTournaments = tournamentsData
    .map((monthData) => ({
      ...monthData,
      events: monthData.events.filter((tournament) => {
        const matchesSearch =
          tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tournament.city.toLowerCase().includes(searchTerm.toLowerCase());
        // For "Upcoming" and "Past" filtering, you'd need actual date comparison logic.
        // For this example, we'll just filter by search term for simplicity.
        // If 'Upcoming' is active, and you had a 'status' field, you'd check status === 'upcoming'.
        // Currently, all mock data is 'upcoming' in nature.
        return matchesSearch;
      }),
    }))
    .filter((monthData) => monthData.events.length > 0); // Only show months with matching events

  return (
    <div className={styles.rootContainer}>
      <div className={styles.mainContentWrapper}>
        <div className={styles.contentContainer}>
          {/* Hero Section */}
          <section className={styles.tournamentsHeroSection}>
            <h2 className={styles.tournamentsHeroHeading}>
              Nissan All India Open Seniors Tennis Tournament 2024, Dehradun
            </h2>
            <p className={styles.tournamentsHeroParagraph}>
              Join us for an exciting tournament in the heart of Dehradun!
            </p>
            <Link to="/explore-tournament" className={styles.exploreButton}>
              Explore
            </Link>
          </section>

          {/* Upcoming Tournaments Section */}
          <section className={styles.upcomingTournaments}>
            <h1 className={styles.sectionTitle}>Upcoming Tournaments</h1>

            {/* Search Bar with Icon */}
            <label className={styles.searchLabel}>
              <div className={styles.searchInnerWrapper}>
                <div className={styles.searchIconWrapper}>
                  <FaSearch className={styles.searchIcon} aria-hidden="true" />
                </div>
                <input
                  placeholder="Search tournaments"
                  className={styles.searchInput}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  aria-label="Search tournaments"
                />
              </div>
            </label>

            {/* Filter Buttons */}
            <div className={styles.filterButtons}>
              <a
                href="#"
                className={`${styles.filterButton} ${
                  activeFilter === "All" ? styles.active : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveFilter("All");
                }}
              >
                <p className={styles.filterButtonText}>All</p>
              </a>
              <a
                href="#"
                className={`${styles.filterButton} ${
                  activeFilter === "Upcoming" ? styles.active : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveFilter("Upcoming");
                }}
              >
                <p className={styles.filterButtonText}>Upcoming</p>
              </a>
              <a
                href="#"
                className={`${styles.filterButton} ${
                  activeFilter === "Past" ? styles.active : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveFilter("Past");
                }}
              >
                <p className={styles.filterButtonText}>Past</p>
              </a>
            </div>

            {/* Render Tournament Listings grouped by month */}
            {filteredTournaments.length > 0 ? (
              filteredTournaments.map((monthData, monthIndex) => (
                <React.Fragment key={monthIndex}>
                  <h3 className={styles.monthlyHeader}>{monthData.month}</h3>
                  {monthData.events.map((tournament, eventIndex) => (
                    <TournamentListing
                      key={`${monthData.month}-${eventIndex}`} // More unique key
                      name={tournament.name}
                      city={tournament.city}
                      date={tournament.date}
                    />
                  ))}
                </React.Fragment>
              ))
            ) : (
              <p className={styles.noResults}>
                No tournaments found matching your criteria.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Tournaments;
