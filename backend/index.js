const express = require("express");
const connectDB = require("./Database/connectDB");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

const PlayerRouter = require("./Route/Player.route.js");
const MemberRouter = require("./Route/Member.route.js");
const EventRouter = require("./Route/Event.route.js");
const MainEventRouter = require("./Route/MainEvent.route.js");
const AdminRouter = require("./Route/Admin.route.js");
const TeamRouter = require("./Route/Team.route.js");

//Player APIs
app.use("/api/player/", PlayerRouter);

//Event APIs
app.use("/api/events/", EventRouter);
app.use("/api/main-events/", MainEventRouter);

// Admin APIs
app.use("/api/admin/", AdminRouter);

app.use("/api/member/", MemberRouter);
app.use("/api/team/", TeamRouter);

// Starting the Server
const PORT_NUMBER = process.env.PORT_NUMBER || 3000;
connectDB().then(() => {
  app.listen(PORT_NUMBER, () => {
    console.log(`Server Listening on http://localhost:${PORT_NUMBER}`);
  });
});
