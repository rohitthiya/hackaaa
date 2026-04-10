import { fetchTopHeadlines, searchNews } from "../services/newsService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getTopHeadlines = async (req, res, next) => {
  try {
    const { country, category } = req.query;
    const news = await fetchTopHeadlines(country, category);
    return sendSuccess(res, 200, "Top headlines fetched successfully", news);
  } catch (error) {
    next(error);
  }
};

export const getNewsSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    const articles = await searchNews(q);
    return sendSuccess(res, 200, "News search results", articles);
  } catch (error) {
    next(error);
  }
};
