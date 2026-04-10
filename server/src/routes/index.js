import express from "express";
import authRoutes from "./authRoutes.js";
import goalRoutes from "./goalRoutes.js";
import newsRoutes from "./newsRoutes.js";
import simulationRoutes from "./simulationRoutes.js";
import profileRoutes from "./profileRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/goals", goalRoutes);
router.use("/news", newsRoutes);
router.use("/simulation", simulationRoutes);
router.use("/profile", profileRoutes);

export default router;