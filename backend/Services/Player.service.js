const Player = require("../models/Player.model.js");
const Team = require("../models/Team.model.js");
const Event = require("../models/Event.model.js");

const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const FOOD_PREFS = ["Veg", "Non-Veg"];

const RegisterPlayer = async (data) => {
  const requiredFields = [
    "name",
    "whatsappNumber",
    "dob",
    "city",
    "shirtSize",
    "shortSize",
    "foodPref",
    "feePaid",
    "stay",
  ];

  for (const field of requiredFields) {
    if (
      !data.hasOwnProperty(field) ||
      data[field] === undefined ||
      data[field] === null ||
      (typeof data[field] === "string" && data[field].trim() === "")
    ) {
      throw new Error(
        `Please fill all the details. Missing or invalid field: ${field}`
      );
    }
  }

  const playerData = {
    name: data.name,
    whatsappNumber: data.whatsappNumber,
    dob: data.dob,
    city: data.city,
    shirtSize: data.shirtSize,
    shortSize: data.shortSize,
    foodPref: data.foodPref,
    stay: data.stay,
    feePaid: data.feePaid,
    transactionDetails: data.feePaid ? data.transactionDetails : "",
  };

  if (playerData.feePaid && !playerData.transactionDetails.trim()) {
    throw new Error("Transaction details are required if fee is paid.");
  }

  const phoneRegex = new RegExp("^[6-9]\\d{9}$");
  if (!phoneRegex.test(playerData.whatsappNumber.toString())) {
    throw new Error("Phone Number is not correct.");
  }

  if (new Date(playerData.dob) > new Date()) {
    throw new Error("Date Of Birth is not correct (cannot be in the future).");
  }

  if (!SHIRT_SIZES.includes(playerData.shirtSize)) {
    throw new Error("Shirt Size Option is not correct.");
  }

  if (!SHIRT_SIZES.includes(playerData.shortSize)) {
    throw new Error("Short Size Option is not correct.");
  }

  if (!FOOD_PREFS.includes(playerData.foodPref)) {
    throw new Error("Incorrect Food Preference.");
  }

  const duplicatePlayer = await Player.findOne({
    whatsappNumber: playerData.whatsappNumber,
  });
  if (duplicatePlayer) {
    throw new Error("The Whatsapp Number is already Registered.");
  }

  const { event1, event2, partner1, partner2 } = data;

  if (!event1 || typeof event1 !== "string" || !event1.trim()) {
    throw new Error("Event 1 cannot be empty.");
  }

  if (event2 && event2 === event1) {
    throw new Error("Event 1 and Event 2 cannot be the same.");
  }

  const Event1 = await Event.findById(event1);
  if (!Event1) {
    throw new Error("Invalid Id for Event 1.");
  }

  let Event2 = null;
  if (event2) {
    Event2 = await Event.findById(event2);
    if (!Event2) {
      throw new Error("Invalid Id for Event 2.");
    }
  }

  let Partner1Team = null;
  if (partner1) {
    const Partner1 = await Player.findById(partner1);
    if (!Partner1) {
      throw new Error("Partner 1 Id is incorrect.");
    }

    Partner1Team = await Team.findOne({
      eventId: event1,
      partner1: partner1,
      $or: [{ partner2: null }, { partner2: { $exists: false } }],
    });

    if (!Partner1Team) {
      throw new Error(
        `Could not find an open team for Partner 1 (${Partner1.name}) in Event 1.`
      );
    }

    if (Partner1Team.partner2) {
      throw new Error(
        `Partner 1 (${Partner1.name}) already has a partner in Event 1.`
      );
    }
  }

  let Partner2Team = null;
  if (event2 && partner2) {
    const Partner2 = await Player.findById(partner2);
    if (!Partner2) {
      throw new Error("Partner 2 Id is incorrect.");
    }

    Partner2Team = await Team.findOne({
      eventId: event2,
      partner1: partner2,
      $or: [{ partner2: null }, { partner2: { $exists: false } }],
    });

    if (!Partner2Team) {
      throw new Error(
        `Could not find an open team for Partner 2 (${Partner2.name}) in Event 2.`
      );
    }

    if (Partner2Team.partner2) {
      throw new Error(
        `Partner 2 (${Partner2.name}) already has a partner in Event 2.`
      );
    }
  }

  const registerPlayer = await Player.create(playerData);
  if (!registerPlayer) {
    throw new Error("Failed to register player.");
  }

  if (Partner1Team) {
    Partner1Team.partner2 = registerPlayer._id;
    await Partner1Team.save();
  } else {
    const lastRank1 = await Team.findOne({ eventId: event1 })
      .sort({ rank: -1 })
      .exec();
    const newRank1 = lastRank1 ? lastRank1.rank + 1 : 1;

    await Team.create({
      eventId: event1,
      partner1: registerPlayer._id,
      partner2: null,
      rank: newRank1,
    });
  }

  if (event2) {
    if (Partner2Team) {
      Partner2Team.partner2 = registerPlayer._id;
      await Partner2Team.save();
    } else {
      const lastRank2 = await Team.findOne({ eventId: event2 })
        .sort({ rank: -1 })
        .exec();
      const newRank2 = lastRank2 ? lastRank2.rank + 1 : 1;

      await Team.create({
        eventId: event2,
        partner1: registerPlayer._id,
        partner2: null,
        rank: newRank2,
      });
    }
  }
};

const loginPlayer = async (data) => {
  const { whatsappNumber, dob } = data;
  if (!whatsappNumber || !dob)
    throw new Error("Both Whatsapp Number and Date of Birth are Required");

  const player = await Player.findOne({ whatsappNumber });
  if (!player) throw new Error("This Whatsapp Number is not Registered");

  if (
    new Date(dob).toISOString().slice(0, 10) !==
    player.dob.toISOString().slice(0, 10)
  )
    throw new Error("Date of Birth is not Correct");

  return { id: player._id, name: player.name };
};

const updatePlayer = async (id, data) => {
  const player = await Player.findById(id);
  if (!player) throw new Error("Incorrect Player Id Provided");

  // --- Player Data Validation ---
  const requiredFields = [
    "name",
    "whatsappNumber",
    "dob",
    "city",
    "shirtSize",
    "shortSize",
    "foodPref",
    "feePaid",
    "stay",
  ];

  for (const field of requiredFields) {
    if (
      !data.hasOwnProperty(field) ||
      data[field] === undefined ||
      data[field] === null
    ) {
      throw new Error(
        `Please fill all the details. Missing or invalid field: ${field}`
      );
    }
  }

  const playerData = {
    name: data.name,
    whatsappNumber: data.whatsappNumber,
    dob: data.dob,
    city: data.city,
    shirtSize: data.shirtSize,
    shortSize: data.shortSize,
    foodPref: data.foodPref,
    stay: data.stay,
    feePaid: data.feePaid,
    transactionDetails: data.feePaid ? data.transactionDetails : "",
  };

  if (playerData.feePaid && !playerData.transactionDetails) {
    throw new Error("Transaction details are required if fee is paid.");
  }

  const phoneRegex = new RegExp("^[6-9]\\d{9}$");
  if (!phoneRegex.test(playerData.whatsappNumber.toString())) {
    throw new Error("Phone Number is not correct.");
  }

  if (new Date(playerData.dob) > new Date()) {
    throw new Error("Date Of Birth is not correct.");
  }

  if (!SHIRT_SIZES.includes(playerData.shirtSize)) {
    throw new Error("Shirt Size Option is not correct.");
  }

  if (!SHIRT_SIZES.includes(playerData.shortSize)) {
    throw new Error("Short Size Option is not correct.");
  }

  if (!FOOD_PREFS.includes(playerData.foodPref)) {
    throw new Error("Incorrect Food Preference.");
  }

  Object.assign(player, playerData);
  await player.save();
};

const updateTeams = async (id, data) => {
  const player = await Player.findById(id);
  if (!player) throw new Error("Incorrect Player Id Provided.");

  const { event1, event2, partner1, partner2 } = data;

  if (!event1 || event1.trim() === "") {
    // More robust check for empty string
    throw new Error("Event 1 cannot be empty.");
  }

  if (event2 && event2.trim() !== "" && event1 === event2) {
    throw new Error("Event 1 and Event 2 cannot be the same.");
  }

  const Event1Doc = await Event.findById(event1);
  if (!Event1Doc) {
    throw new Error("Invalid Id for Event 1.");
  }

  let Event2Doc = null;
  if (event2 && event2.trim() !== "") {
    Event2Doc = await Event.findById(event2);
    if (!Event2Doc) {
      throw new Error("Invalid Id for Event 2.");
    }
  }

  let Partner1TeamForNewEvent1 = null;
  if (partner1 && partner1.trim() !== "") {
    const Partner1 = await Player.findById(partner1);
    if (!Partner1) {
      throw new Error("Partner 1 Id is incorrect.");
    }
    Partner1TeamForNewEvent1 = await Team.findOne({
      eventId: event1,
      partner1: partner1,
      partner2: "", // Looking for an open team for partner1
    });
    if (!Partner1TeamForNewEvent1) {
      throw new Error(
        `Could not find an open team for Partner 1 (${Partner1.name}) in Event 1.`
      );
    }
    if (
      Partner1TeamForNewEvent1.partner2 &&
      Partner1TeamForNewEvent1.partner2.toString() !== ""
    ) {
      throw new Error(
        `Partner 1 (${Partner1.name}) already has a partner in Event 1.`
      );
    }
  }

  let Partner2TeamForNewEvent2 = null;
  if (event2 && event2.trim() !== "" && partner2 && partner2.trim() !== "") {
    const Partner2 = await Player.findById(partner2);
    if (!Partner2) {
      throw new Error("Partner 2 Id is incorrect.");
    }
    Partner2TeamForNewEvent2 = await Team.findOne({
      eventId: event2,
      partner1: partner2,
      partner2: "", // Looking for an open team for partner2
    });
    if (!Partner2TeamForNewEvent2) {
      throw new Error(
        `Could not find an open team for Partner 2 (${Partner2.name}) in Event 2.`
      );
    }
    if (
      Partner2TeamForNewEvent2.partner2 &&
      Partner2TeamForNewEvent2.partner2.toString() !== ""
    ) {
      throw new Error(
        `Partner 2 (${Partner2.name}) already has a partner in Event 2.`
      );
    }
  }

  // --- 3. Fetch Player's Current Teams ---
  const playerCurrentTeams = await Team.find({
    $or: [{ partner1: id }, { partner2: id }],
  });

  // --- 4. Start Transaction for Atomic Operations ---
  // Requires MongoDB replica set for transactions.
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // --- 5. Process Old Teams (Cleanup or Promote Partners) ---
    const newEventIds = [event1];
    if (event2 && event2.trim() !== "") {
      newEventIds.push(event2);
    }

    for (const currentTeam of playerCurrentTeams) {
      const currentTeamEventId = currentTeam.eventId.toString();

      // Check if the player is staying in this event
      if (!newEventIds.includes(currentTeamEventId)) {
        // Player is leaving this event (not in new event1 or new event2)
        if (currentTeam.partner1.toString() === id.toString()) {
          // Player was partner1 in this old team
          if (currentTeam.partner2 && currentTeam.partner2.toString() !== "") {
            // Promote partner2 to partner1
            currentTeam.partner1 = currentTeam.partner2;
            currentTeam.partner2 = "";
            await currentTeam.save({ session });
          } else {
            // Solo player, delete the team
            await currentTeam.deleteOne({ session });
          }
        } else if (
          currentTeam.partner2 &&
          currentTeam.partner2.toString() === id.toString()
        ) {
          // Player was partner2 in this old team, make partner1 solo
          currentTeam.partner2 = "";
          await currentTeam.save({ session });
        }
      } else {
        // Player is staying in this event.
        // We will explicitly manage their new role/team for this event in step 6.
        // For simplicity in update, we'll remove them from their old role here if it's changing.
        // This avoids complex state comparisons and instead rebuilds the player's role for this event.

        // Determine if player will be partner1 or partner2 in this new configuration for this event
        const willBePartner2InEvent1 =
          currentTeamEventId === event1 && partner1 && partner1.trim() !== "";
        const willBePartner2InEvent2 =
          currentTeamEventId === event2 && partner2 && partner2.trim() !== "";
        const willBePartner2 = willBePartner2InEvent1 || willBePartner2InEvent2;

        if (currentTeam.partner1.toString() === id.toString()) {
          // Player was partner1
          if (willBePartner2) {
            // Player is now becoming partner2 in this event
            if (
              currentTeam.partner2 &&
              currentTeam.partner2.toString() !== ""
            ) {
              // Promote existing partner2 to partner1
              currentTeam.partner1 = currentTeam.partner2;
              currentTeam.partner2 = "";
              await currentTeam.save({ session });
            } else {
              // Player was solo partner1, now needs to be removed to join new team
              await currentTeam.deleteOne({ session });
            }
          }
          // If they were partner1 and remain partner1/solo, no action here, new team will be created if needed in step 6
        } else if (
          currentTeam.partner2 &&
          currentTeam.partner2.toString() === id.toString()
        ) {
          // Player was partner2
          if (!willBePartner2) {
            // Player is no longer partner2 in this event
            currentTeam.partner2 = ""; // Make partner1 solo
            await currentTeam.save({ session });
          }
          // If they were partner2 and remain partner2, no action here, new team will be updated in step 6
        }
      }
    }

    // --- 6. Create/Update Teams for New Event Selections ---

    // Handle Event 1
    const playerAlreadyHasTeamInEvent1 = playerCurrentTeams.some(
      (team) =>
        team.eventId.toString() === Event1Doc._id.toString() &&
        (team.partner1.toString() === id.toString() ||
          (team.partner2 && team.partner2.toString() === id.toString()))
    );

    if (Partner1TeamForNewEvent1) {
      // Player joins an existing team for Event 1 as Partner 2
      Partner1TeamForNewEvent1.partner2 = id;
      await Partner1TeamForNewEvent1.save({ session });
    } else if (
      !playerAlreadyHasTeamInEvent1 ||
      (playerCurrentTeams.find(
        (t) =>
          t.eventId.toString() === Event1Doc._id.toString() &&
          t.partner1.toString() === id.toString() &&
          t.partner2 &&
          t.partner2.toString() !== ""
      ) &&
        partner1 &&
        partner1.trim() === "")
    ) {
      // Player is Partner 1 for Event 1 (new team, or was solo and remains solo, or was partner2 and now solo)
      // Get the last rank for Event 1 to assign the new rank
      const lastRank1 = await Team.findOne({ eventId: event1 })
        .sort({ rank: -1 })
        .exec();
      const newRank1 = lastRank1 ? lastRank1.rank + 1 : 1;

      await Team.create(
        [
          {
            // Use array syntax for create within a session
            eventId: event1,
            partner1: id,
            partner2: "",
            rank: newRank1,
          },
        ],
        { session }
      );
    }

    // Handle Event 2 (if applicable)
    if (Event2Doc) {
      const playerAlreadyHasTeamInEvent2 = playerCurrentTeams.some(
        (team) =>
          team.eventId.toString() === Event2Doc._id.toString() &&
          (team.partner1.toString() === id.toString() ||
            (team.partner2 && team.partner2.toString() === id.toString()))
      );

      if (Partner2TeamForNewEvent2) {
        // Current player joins existing team for Event 2 as Partner 2
        Partner2TeamForNewEvent2.partner2 = id;
        await Partner2TeamForNewEvent2.save({ session });
      } else if (
        !playerAlreadyHasTeamInEvent2 ||
        (playerCurrentTeams.find(
          (t) =>
            t.eventId.toString() === Event2Doc._id.toString() &&
            t.partner1.toString() === id.toString() &&
            t.partner2 &&
            t.partner2.toString() !== ""
        ) &&
          partner2 &&
          partner2.trim() === "")
      ) {
        // Current player is Partner 1 for Event 2 (new team, or was solo and remains solo, or was partner2 and now solo)
        // Get the last rank for Event 2 to assign the new rank
        const lastRank2 = await Team.findOne({ eventId: event2 })
          .sort({ rank: -1 })
          .exec();
        const newRank2 = lastRank2 ? lastRank2.rank + 1 : 1;

        await Team.create(
          [
            {
              // Use array syntax for create within a session
              eventId: event2,
              partner1: id,
              partner2: "",
              rank: newRank2,
            },
          ],
          { session }
        );
      }
    }

    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "Teams updated successfully." };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating teams:", error);
    throw error; // Re-throw the error after rolling back
  }
};

module.exports = { RegisterPlayer, loginPlayer, updatePlayer, updateTeams };
