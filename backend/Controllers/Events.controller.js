const Event = require("../models/Event.model.js");

const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({
      success: true,
      message: "Fetched Events Successfully",
      data: events,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const addEvent = async (req, res) => {
  try {
    const { name, date, rules } = req.body;
    if (!name || !date) throw new Error("All Details are Required");

    if (new Date(date.dob) < new Date()) {
      throw new Error("Date Of Birth is not correct.");
    }

    const event = await Event.create({
      name,
      date,
      rules,
    });

    res.status(200).json({
      success: true,
      message: "The Event has been Added",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getEvents, addEvent };
