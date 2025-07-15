const express = require("express");
const EventController = require("../Controllers/Events.controller.js");

const router = express.Router();

router.get("/", EventController.getEvents);

router.post("/add/", EventController.addEvent);

module.exports = router;
