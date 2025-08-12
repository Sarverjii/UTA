import React, { useState, useEffect, memo, useCallback } from "react";
import api from "../../../api";
import styles from "./ManageResult.module.css"; // Will create this CSS file
import { toast } from "sonner";

const Match = ({
  team,
  isWinnerSlot = false,
  roundIndex,
  matchId,
  slotType,
}) => {
  let teamDisplayName;
  if (isWinnerSlot) {
    teamDisplayName = "Winner";
  } else if (!team) {
    teamDisplayName = roundIndex === 0 ? "BYE" : "TBD";
  } else {
    teamDisplayName = `${team.partner1?.name || "Unknown"} ${
      team.partner2 ? `& ${team.partner2?.name || "Unknown"}` : ""
    }`;
  }

  // This input will be purely visual for individual team scores, not directly updating match.Score
  // The actual match.Score update will happen in the Round component's score input.
  const [displayScore, setDisplayScore] = useState(""); // Local state for display

  return (
    <div className={styles.matchSlot}>
      <div className={styles.teamName}>{teamDisplayName}</div>
      {!isWinnerSlot &&
        team && ( // Only show score input for actual teams, not winner slots
          <input
            type="text"
            placeholder="0-0" // Example placeholder
            value={displayScore}
            onChange={(e) => setDisplayScore(e.target.value)}
            className={styles.teamScoreInput} // New CSS class
          />
        )}
    </div>
  );
};

const Round = memo(
  ({ title, matches, roundIndex, totalRounds, onUpdateMatch }) => {
    const isLastRound = totalRounds - 1;

    const handleStatusChange = (matchId, newStatus) => {
      onUpdateMatch(matchId, { Status: newStatus });
    };

    return (
      <div className={styles.roundContainer}>
        <h2 className={styles.roundTitle}>{title}</h2>
        <div className={styles.matchesContainer}>
          {matches.map((match, matchIndex) => (
            <React.Fragment
              key={match._id || `match-${roundIndex}-${matchIndex}`}
            >
              <div className={styles.matchPair}>
                <div className={styles.matchNumber}>
                  Match {match.Match_number}
                </div>
                {/* Status Dropdown */}
                <select
                  value={match.Status} // Default to current status
                  onChange={(e) =>
                    handleStatusChange(match._id, e.target.value)
                  }
                  className={styles.matchStatusDropdown} // New CSS class for styling
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <Match
                  key={`${match._id}-team1`} // Add key
                  team={match.Team1}
                  roundIndex={roundIndex}
                  matchId={match._id}
                  slotType="Team1"
                />
                <Match
                  key={`${match._id}-team2`} // Add key
                  team={match.Team2}
                  roundIndex={roundIndex}
                  matchId={match._id}
                  slotType="Team2"
                />
              </div>
              {!isLastRound && <div className={styles.connectorLine}></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
);

const ManageResult = () => {
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
        toast.error(error.response?.data?.message || "Error fetching data.");
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

  const handleUpdateMatch = useCallback(async (matchId, updateData) => {
    try {
      const response = await api.put(
        // Capture response to get updated data
        `http://localhost:3000/api/nissan-draws/${matchId}`,
        updateData,
        { withCredentials: true }
      );
      toast.success("Match updated successfully!");

      // Update local state with the new data from the response
      setDraws((prevDraws) =>
        prevDraws.map((draw) => {
          if (draw._id === matchId) {
            const updatedDrawData = response.data.data;
            let newWinner = draw.Winner; // Start with existing populated winner

            // If the API response includes a Winner ID, find the corresponding populated team
            if (updatedDrawData.Winner) {
              if (draw.Team1 && draw.Team1._id === updatedDrawData.Winner) {
                newWinner = draw.Team1;
              } else if (
                draw.Team2 &&
                draw.Team2._id === updatedDrawData.Winner
              ) {
                newWinner = draw.Team2;
              } else {
                // If winner is not Team1 or Team2, or not found, use the ID directly
                newWinner = updatedDrawData.Winner;
              }
            } else if (updatedDrawData.Winner === null) {
              newWinner = null; // Explicitly set to null if API sends null
            }

            return {
              ...draw, // Keep all existing fields
              Score:
                updatedDrawData.Score !== undefined
                  ? updatedDrawData.Score
                  : draw.Score,
              Status:
                updatedDrawData.Status !== undefined
                  ? updatedDrawData.Status
                  : draw.Status,
              Winner: newWinner,
            };
          }
          return draw;
        })
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update match.");
      console.error("Error updating match:", error);
    }
  }, []); // Empty dependency array means it's created once

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
  const totalRounds = rounds.length;

  return (
    <div className={styles.manageResultContainer}>
      {" "}
      {/* Changed class name */}
      <h1>Manage Results</h1> {/* Changed title */}
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
        {/* Removed Create/Delete buttons */}
      </div>
      {loading ? (
        <p>Loading results...</p>
      ) : draws.length === 0 ? (
        <p>No results available for this event yet.</p>
      ) : (
        <div className={styles.bracketContainer}>
          {rounds.map((round, roundIndex) => (
            <Round
              key={round.title}
              title={round.title}
              matches={round.matches}
              roundIndex={roundIndex}
              totalRounds={totalRounds}
              onUpdateMatch={handleUpdateMatch} // Pass the function
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageResult;








