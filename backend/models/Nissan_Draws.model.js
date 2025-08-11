const mongoose = require("mongoose");

const nissanDrawsSchema = new mongoose.Schema({
  Event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  Stage: {
    type: String,
    required: true,
  },
  Match_number: {
    type: Number,
    required: true,
  },
  Team1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  Team2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  Winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  Score: {
    type: String,
  },
  Status: {
    type: String,
    enum: ["Upcoming", "In Progress", "Completed"],
    default: "Upcoming",
  },
});

const Nissan_Draws = mongoose.model("Nissan_Draws", nissanDrawsSchema);

module.exports = Nissan_Draws;