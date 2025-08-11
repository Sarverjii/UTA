const drawService = require("../Services/Nissan_Draws.service.js");

exports.createDrawforEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const result = await drawService.createDrawforEvent(eventId);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getDrawsByEvent = async (req, res) => {
  try {
    const draws = await drawService.getDrawsByEvent(req.params.eventId);
    res.status(200).json({ success: true, data: draws });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateDraw = async (req, res) => {
  try {
    const updatedDraw = await drawService.updateDraw(
      req.params.drawId,
      req.body
    );
    res.status(200).json({ success: true, data: updatedDraw });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteDraw = async (req, res) => {
  try {
    await drawService.deleteDraw(req.params.drawId);
    res
      .status(200)
      .json({ success: true, message: "Draw deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateDrawOrder = async (req, res) => {
  try {
    const { orderedMatches } = req.body;
    await drawService.updateDrawOrder(orderedMatches);
    res
      .status(200)
      .json({ success: true, message: "Draw order updated successfully." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateMatchup = async (req, res) => {
  try {
    console.log("RAN 1");
    const { matchId, teamField, teamId } = req.body;
    await drawService.updateMatchup(matchId, teamField, teamId);
    res
      .status(200)
      .json({ success: true, message: "Matchup updated successfully." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
