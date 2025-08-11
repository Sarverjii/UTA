const mongoose = require("mongoose");
const Nissan_Draws = require("../models/Nissan_Draws.model.js");
const Team = require("../models/Team.model.js");

// Helper function to generate a standard single-elimination bracket seeding order
// This generates the order of seeds (1-indexed) for a bracket of given size.
// Example: generateBracketSeedingOrder(8) => [1, 8, 4, 5, 2, 7, 3, 6]
const generateBracketSeedingOrder = (numSlots) => {
  const order = [];
  const recurse = (min, max) => {
    if (min > max) return;
    if (min === max) {
      order.push(min);
      return;
    }
    order.push(min);
    order.push(max);
    if (max - min > 1) {
      recurse(min + 1, max - 1);
    }
  };
  recurse(1, numSlots);
  return order;
};

exports.createDrawforEvent = async (eventId) => {
  try {
    await Nissan_Draws.deleteMany({ Event: eventId });

    const teams = await Team.find({ eventId }).sort({ rank: "asc" });
    const numTeams = teams.length;

    if (numTeams < 2) {
      throw new Error("Not enough teams for a draw.");
    }

    const bracketSize = Math.pow(2, Math.ceil(Math.log2(numTeams)));
    const numRounds = Math.log2(bracketSize);
    const byes = bracketSize - numTeams;

    let seededParticipants = new Array(bracketSize).fill(null); // Array to hold teams in bracket order

    // Get the standard seeding order for the bracket size
    const seedingOrder = generateBracketSeedingOrder(bracketSize);

    // Place teams into the bracket slots according to seeding order
    // Teams are 1-indexed for seeding, so adjust to 0-indexed array
    for (let i = 0; i < numTeams; i++) {
      const seed = i + 1; // Current team's seed (1-indexed)
      const bracketPosition = seedingOrder.indexOf(seed); // Find where this seed goes in the bracket
      seededParticipants[bracketPosition] = teams[i]._id; // Place the team (0-indexed) at that position
    }

    // Create Round 1 matches
    let matches = [];
    let matchNum = 1;
    for (let i = 0; i < bracketSize / 2; i++) {
      const team1 = seededParticipants[i * 2];
      const team2 = seededParticipants[i * 2 + 1];

      matches.push({
        Event: eventId,
        Stage: "Round 1",
        Match_number: matchNum++,
        Team1: team1,
        Team2: team2,
      });
    }

    // Create subsequent rounds with null teams
    let numMatchesInNextRound = bracketSize / 4; // Matches in Round 2
    for (let round = 2; round <= numRounds; round++) {
      for (let i = 0; i < numMatchesInNextRound; i++) {
        matches.push({
          Event: eventId,
          Stage: `Round ${round}`,
          Match_number: matchNum++,
          Team1: null,
          Team2: null,
        });
      }
      numMatchesInNextRound /= 2;
    }

    await Nissan_Draws.insertMany(matches);
    return { message: "Draws created successfully." };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getDrawsByEvent = async (eventId) => {
  try {
    const draws = await Nissan_Draws.find({ Event: eventId })
      .populate({
        path: "Team1",
        populate: { path: "partner1 partner2", select: "name" },
      })
      .populate({
        path: "Team2",
        populate: { path: "partner1 partner2", select: "name" },
      })
      .populate("Winner");
    return draws;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateDraw = async (drawId, updateData) => {
  try {
    const updatedDraw = await Nissan_Draws.findByIdAndUpdate(
      drawId,
      updateData,
      { new: true }
    );
    return updatedDraw;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteDraw = async (drawId) => {
  try {
    await Nissan_Draws.findByIdAndDelete(drawId);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateDrawOrder = async (orderedMatches) => {
  try {
    const promises = orderedMatches.map((matchId, index) => {
      return Nissan_Draws.findByIdAndUpdate(matchId, {
        Match_number: index + 1,
      });
    });
    await Promise.all(promises);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateMatchup = async (matchId, teamField, teamId) => {
  try {
    console.log(matchId + " " + teamField + " " + teamId);
    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      throw new Error(`Invalid matchId: ${matchId}`);
    }

    if (teamId && !mongoose.Types.ObjectId.isValid(teamId)) {
      throw new Error(`Invalid teamId: ${teamId}`);
    }

    const updateData = { [teamField]: teamId ? teamId : null };
    await Nissan_Draws.findByIdAndUpdate(matchId, updateData);
  } catch (error) {
    console.error("Error in updateMatchup service:", error);
    throw new Error(error.message);
  }
};

exports.swapMatchup = async (sourceMatchId, sourceSlotType, targetMatchId, targetSlotType, draggedTeamId, originalTargetTeamId) => {
  try {
    // Update target slot with dragged team
    const updateTargetData = { [targetSlotType]: draggedTeamId ? draggedTeamId : null };
    await Nissan_Draws.findByIdAndUpdate(targetMatchId, updateTargetData);

    // Update source slot with original target team
    const updateSourceData = { [sourceSlotType]: originalTargetTeamId ? originalTargetTeamId : null };
    await Nissan_Draws.findByIdAndUpdate(sourceMatchId, updateSourceData);

  } catch (error) {
    console.error("Error in swapMatchup service:", error);
    throw new Error(error.message);
  }
};
