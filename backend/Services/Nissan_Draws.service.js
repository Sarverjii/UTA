const mongoose = require("mongoose");
const Nissan_Draws = require("../models/Nissan_Draws.model.js");
const Team = require("../models/Team.model.js");

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

    // --- Build top-to-bottom bracket seed order ---
    function buildBracketSlots(n) {
      if (n === 1) return [1];
      const half = buildBracketSlots(n / 2);
      const mirror = half.map((x) => n + 1 - x);
      const out = [];
      for (let i = 0; i < half.length; i++) {
        out.push(half[i]);
        out.push(mirror[i]);
      }
      return out;
    }
    const slots = buildBracketSlots(bracketSize);

    let matches = [];
    let matchNum = 1;

    // --- Create Round 1 matches in visual bracket order ---
    for (let i = 0; i < slots.length; i += 2) {
      const seedA = slots[i];
      const seedB = slots[i + 1];

      const teamA = seedA <= numTeams ? teams[seedA - 1]._id : null;
      const teamB = seedB <= numTeams ? teams[seedB - 1]._id : null;

      // Skip match if both are empty
      if (teamA === null && teamB === null) continue;

      matches.push({
        Event: eventId,
        Stage: "Round 1",
        Match_number: matchNum++,
        Team1: teamA,
        Team2: teamB,
      });
    }

    // --- Create subsequent rounds with null teams ---
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

exports.swapMatchup = async (
  sourceMatchId,
  sourceSlotType,
  targetMatchId,
  targetSlotType,
  draggedTeamId,
  originalTargetTeamId
) => {
  try {
    // Update target slot with dragged team
    const updateTargetData = {
      [targetSlotType]: draggedTeamId ? draggedTeamId : null,
    };
    await Nissan_Draws.findByIdAndUpdate(targetMatchId, updateTargetData);

    // Update source slot with original target team
    const updateSourceData = {
      [sourceSlotType]: originalTargetTeamId ? originalTargetTeamId : null,
    };
    await Nissan_Draws.findByIdAndUpdate(sourceMatchId, updateSourceData);
  } catch (error) {
    console.error("Error in swapMatchup service:", error);
    throw new Error(error.message);
  }
};
