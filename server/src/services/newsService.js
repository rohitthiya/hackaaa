import { newsApi } from "../config/newsClient.js";

export const fetchTopHeadlines = async (country = "us", category) => {
  const params = { country };
  if (category) params.category = category;

  const { data } = await newsApi.get("/top-headlines", { params });
  if (data.status !== "ok") throw new Error("Failed to fetch news");
  return data.articles;
};

export const searchNews = async (query) => {
  if (!query || query.trim().length === 0) {
    throw new Error("Search query cannot be empty");
  }

  const { data } = await newsApi.get("/everything", {
    params: { q: query.trim(), sortBy: "publishedAt", language: "en" }
  });

  if (data.status !== "ok") throw new Error("Failed to fetch search results");
  return data.articles;
};
