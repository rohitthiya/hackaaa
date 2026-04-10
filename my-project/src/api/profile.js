// src/api/profile.js
import client from './client';

export const fetchProfile = () =>
  client.get('/profile').then((r) => r.data);

export const saveProgress = (step, answers, status = 'in_progress') =>
  client.post('/profile/progress', { step, answers, status }).then((r) => r.data);

export const completeProfile = (answers) =>
  client.post('/profile/complete', { answers }).then((r) => r.data);

export const deferProfile = () =>
  client.post('/profile/defer').then((r) => r.data);
