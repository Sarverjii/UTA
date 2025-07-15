const express = require("express");
const PlayerController = require("../Controllers/Player.controller.js");

const router = express.Router();

router.get("/", PlayerController.getPlayers);
router.post("/register/", PlayerController.RegisterPlayer);
router.post("/login", PlayerController.loginPlayer);
router.post("/:id/updatePlayer", PlayerController.updatePlayer);
router.post("/:id/updateTeams", PlayerController.updateTeams);

module.exports = router;
