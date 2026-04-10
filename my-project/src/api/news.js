// src/api/news.js
import client from './client';

export const getTopHeadlines = (params = {}) =>
  client.get('/news/top-headlines', { params }).then((r) => r.data);

export const searchNews = (q) =>
  client.get('/news/search', { params: { q } }).then((r) => r.data);
