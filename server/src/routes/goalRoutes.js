import express from "express";
import { createGoal, getGoals } from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createGoal);
router.get("/", protect, getGoals);

export default router;