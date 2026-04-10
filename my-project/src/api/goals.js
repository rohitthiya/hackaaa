// src/api/goals.js
import client from './client';

export const createGoal = (data) =>
  client.post('/goals', data).then((r) => r.data);

export const getGoals = () =>
  client.get('/goals').then((r) => r.data);
