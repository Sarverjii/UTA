import React, { useState, useEffect } from "react";
import api from "../../../api";
import styles from "./ManageDraw.module.css";
import { toast } from "sonner";

const Team = ({ team }) => {
  const teamDisplayName = team
    ? `${team.partner1?.name || "Unknown"} ${
        team.partner2 ? `& ${team.partner2?.name || "Unknown"}` : ""
      }`
    : "TBD";

  return <div className={styles.teamName}>{teamDisplayName}</div>;
};

const Match = ({ match }) => {
  if (!match) return null;

  return (
    <div className={styles.matchContainer}>
        <div className={styles.team}><Team team={match.Team1} /></div>
        <div className={styles.team}><Team team={match.Team2} /></div>
    </div>
  );
};

const Round = ({ title, matches }) => {
  return (
    <div className={styles.roundContainer}>
      <h2 className={styles.roundTitle}>{title}</h2>
      <div className={styles.matchesContainer}>
        {matches.map((match) => (
          <Match key={match._id} match={match} />
        ))}
      </div>
    </div>
  );
};

const ManageDraw = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDraws = async () => {
    if (selectedEvent) {
      setLoading(true);
      try {
        const drawsRes = await api.get(
          `http://localhost:3000/api/nissan-draws/${selectedEvent}`,
          { withCredentials: true }
        );
        setDraws(drawsRes.data.data);
      } catch (error) {
        toast.error("Error fetching data.");
        console.error("Error fetching data:", error);
        setDraws([]);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("http://localhost:3000/api/events", {
          withCredentials: true,
        });
        setEvents(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedEvent(res.data.data[0]._id);
        }
      } catch (error) {
        toast.error("Error fetching events.");
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchDraws();
  }, [selectedEvent]);

  const handleCreateDraws = async () => {
    if (selectedEvent) {
      setLoading(true);
      try {
        await api.post(
          "http://localhost:3000/api/nissan-draws/",
          { eventId: selectedEvent },
          { withCredentials: true }
        );
        toast.success("Draws created/reset successfully!");
        fetchDraws();
      } catch (error) {
        toast.error("Failed to create/reset draws.");
        console.error("Error creating draws:", error);
      }
      setLoading(false);
    }
  };

  const handleDeleteDraws = async () => {
    if (selectedEvent && draws.length > 0) {
      setLoading(true);
      try {
        for (const draw of draws) {
          await api.delete(
            `http://localhost:3000/api/nissan-draws/${draw._id}`,
            { withCredentials: true }
          );
        }
        setDraws([]);
        toast.success("All draws for this event deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete draws.");
        console.error("Error deleting draws:", error);
      }
      setLoading(false);
    }
  };

  const buildRounds = (draws) => {
    if (!draws || draws.length === 0) return [];

    const roundsData = draws.reduce((acc, draw) => {
      const { Stage } = draw;
      if (!acc[Stage]) {
        acc[Stage] = [];
      }
      acc[Stage].push(draw);
      return acc;
    }, {});

    return Object.entries(roundsData)
      .sort(([stageA], [stageB]) => {
        const numA = parseInt(stageA.split(" ")[1] || 0);
        const numB = parseInt(stageB.split(" ")[1] || 0);
        return numA - numB;
      })
      .map(([stage, matches]) => ({
        title: stage,
        matches: matches.sort((a, b) => a.Match_number - b.Match_number),
      }));
  };

  const rounds = buildRounds(draws);

  return (
    <div className={styles.manageDrawContainer}>
      <h1>Manage Draws</h1>
      <div className={styles.eventFilterButtons}>
        {events.map((event) => (
          <button
            key={event._id}
            className={`${styles.filterButton} ${
              selectedEvent === event._id ? styles.active : ""
            }`}
            onClick={() => setSelectedEvent(event._id)}
          >
            {event.name}
          </button>
        ))}
      </div>
      <div className={styles.controls}>
        <button
          onClick={handleCreateDraws}
          className={styles.drawButton}
          disabled={loading || !selectedEvent}
        >
          {loading
            ? "Loading..."
            : draws.length > 0
            ? "Reset Draws"
            : "Create Draws"}
        </button>
        {draws.length > 0 && (
          <button
            onClick={handleDeleteDraws}
            className={styles.deleteDrawButton}
            disabled={loading || !selectedEvent}
          >
            Delete All Draws
          </button>
        )}
      </div>

      {draws.length > 0 && (
        <div className={styles.bracketContainer}>
          {rounds.map((round) => (
            <Round key={round.title} title={round.title} matches={round.matches} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageDraw;