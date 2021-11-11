import express from "express";

import { getChannels, getAllNews } from "../controllers/Channel.js";

const channelsRoute = express.Router();

channelsRoute.get("/", getChannels);

channelsRoute.get("/:channelname/allnews", getAllNews);

export default channelsRoute;
