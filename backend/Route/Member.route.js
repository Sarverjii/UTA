const express = require("express");
const PlayerLoginController = require("../Controllers/Member.controller.js");
const { authenticateDB } = require("../MiddleWare/authMiddleware.js");

const router = express.Router();

router.post("/register/", PlayerLoginController.register);

router.post("/login/", PlayerLoginController.login);

router.get("/get", authenticateDB, PlayerLoginController.getMe);

router.post("/logout/", PlayerLoginController.logout);

module.exports = router;
