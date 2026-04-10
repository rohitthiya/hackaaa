import express from "express";
import { getTopHeadlines, getNewsSearch } from "../controllers/newsController.js";

const router = express.Router();

// GET /api/news/top-headlines?country=us&category=technology
router.get("/top-headlines", getTopHeadlines);

// GET /api/news/search?q=keyword
router.get("/search", getNewsSearch);

export default router;
