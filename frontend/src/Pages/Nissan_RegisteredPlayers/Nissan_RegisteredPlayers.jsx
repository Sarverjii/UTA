import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./RegisteredPlayers.module.css";
import { Link } from "react-router-dom";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

const RegisteredPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // State for active event filter
  const [searchTerm, setSearchTerm] = useState(""); // State for search bar

  const getPlayers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/player/`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setPlayers(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    getPlayers();
    getEvents();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (events.length > 0 && selectedEvent === null) {
      setSelectedEvent(events[0]._id);
    }
  }, [events]);

  // Filtered players based on selectedEvent and searchTerm
  const filteredPlayers = players.filter((player) => {
    const matchesEvent = selectedEvent
      ? player.eventId?._id === selectedEvent // Assuming eventId is ObjectId from backend
      : true;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      player.partner1?.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      player.partner2?.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      player.eventId?.name.toLowerCase().includes(lowerCaseSearchTerm); // Also allow searching by event name

    return matchesEvent && matchesSearch;
  });

  return (
    <>
      <Header />
      <div className={styles.container}>
        {/* <header className={styles.header}>
        <div className={styles.headerLogoGroup}>
          <div className={styles.logoIcon}>
            <img src="/logo.png" alt="UTA LOGO" />
          </div>
        </div>
        <h2 className={styles.headerTitle}>Uttranchal Tennis Association</h2>
        <Link to={"/tournaments"}>Back to Home</Link>
      </header> */}
        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>Registered Teams</h2>

          {/* --- Search and Filter Section --- */}
          <div className={styles.filtersContainer}>
            <input
              type="text"
              placeholder="Search players or events..."
              className={styles.searchBar}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className={styles.eventFilters}>
              {/* <button
                className={`${styles.filterButton} ${
                  selectedEvent === null ? styles.activeFilter : ""
                }`}
                onClick={() => setSelectedEvent(null)}
              >
                All Events
              </button> */}
              {events.map((event) => (
                <button
                  key={event._id}
                  className={`${styles.filterButton} ${
                    selectedEvent === event._id ? styles.activeFilter : ""
                  }`}
                  onClick={() => setSelectedEvent(event._id)}
                >
                  {event.name}
                </button>
              ))}
            </div>
          </div>
          {/* --- End Search and Filter Section --- */}

          {loading ? (
            <div className={styles.noPlayersMessage}>
              Loading registered players...
            </div>
          ) : filteredPlayers.length > 0 ? ( // Use filteredPlayers here
            <div className={styles.tableContainer}>
              <table className={styles.playersTable}>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Player 1</th>
                    <th>Player 2</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player) => (
                    <tr key={player._id}>
                      <td data-label="Event">
                        {player.eventId?.name || "N/A"}
                      </td>
                      <td data-label="Player 1">
                        {player.partner1?.name || "N/A"}
                      </td>
                      <td data-label="Player 2">
                        {player.partner2?.name || "Partner Not Yet Registered"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.noPlayersMessage}>
              No registered players found matching your criteria.
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
};

export default RegisteredPlayers;
