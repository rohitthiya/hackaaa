import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const NEWS_API_URL = process.env.NEWSAPIURL || "https://newsapi.org/v2";
const NEWS_API_KEY = process.env.NEWSAPIKEY;

if (!NEWS_API_KEY) {
  throw new Error("Missing NEWSAPIKEY in environment variables");
}

export const newsApi = axios.create({
  baseURL: NEWS_API_URL,
  headers: {
  "X-Api-Key": NEWS_API_KEY
}
});
