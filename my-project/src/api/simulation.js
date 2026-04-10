// src/api/simulation.js
import client from './client';

// investmentType: 'stocks' | 'mutual' | 'fd' | 'crypto'
// amount: number, duration: number (months)
export const runSimulation = (data) =>
  client.post('/simulation/simulate', data).then((r) => r.data);
