import express from "express";
import { runSimulation } from "../controllers/simulationController.js";

const router = express.Router();

// POST /api/simulation/simulate
router.post("/simulate", runSimulation);

export default router;