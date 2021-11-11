import express from "express";

import { getNews, getOneNews, deleteNews } from "../controllers/News.js";
import { isAuth, isAdmin } from "../utils/helpers.js";

const newsRoute = express.Router();

newsRoute.get("/", getNews);
newsRoute.get("/:newsId", getOneNews);
newsRoute.delete("/:newsId", isAuth, isAdmin, deleteNews);

export default newsRoute;
