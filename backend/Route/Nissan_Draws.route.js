const express = require("express");
const drawController = require("../Controllers/Nissan_Draws.controller.js");
const { isAdmin } = require("../MiddleWare/authMiddleware.js");

const router = express.Router();

router.post("/", isAdmin, drawController.createDrawforEvent);
router.get("/:eventId", drawController.getDrawsByEvent);
router.put("/:drawId", isAdmin, drawController.updateDraw);
router.delete("/:drawId", isAdmin, drawController.deleteDraw);

router.put("/update-matchup/", isAdmin, drawController.updateMatchup);
router.put("/update-order", isAdmin, drawController.updateDrawOrder);

module.exports = router;
