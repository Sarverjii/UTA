const PlayerService = require("../Services/Player.service.js");
const Team = require("../models/Team.model.js");

const getPlayers = async (req, res) => {
  try {
    const players = await Team.find()
      .populate("partner1", "name _id")
      .populate("partner2", "name _id")
      .populate("eventId");
    res.status(200).json({
      success: true,
      message: "Fetched Players Successfully",
      data: players,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error Fetching the Players",
    });
  }
};

const RegisterPlayer = async (req, res) => {
  try {
    await PlayerService.RegisterPlayer(req.body);
    res.status(200).json({
      success: true,
      message: "Player and Team has been registered successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const loginPlayer = async (req, res) => {
  try {
    const data = await PlayerService.loginPlayer(req.body);
    res.status(200).json({
      success: true,
      message: `Welcome ${data.name}`,
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePlayer = async (req, res) => {
  try {
    await PlayerService.updatePlayer(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: `Your Personal Details have been updated`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTeams = async (req, res) => {
  try {
    await PlayerService.updateTeams(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: `Your Teams have been updated`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  RegisterPlayer,
  loginPlayer,
  updatePlayer,
  updateTeams,
  getPlayers,
};
