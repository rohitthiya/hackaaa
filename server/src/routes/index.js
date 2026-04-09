import express from "express";
import newsRoutes from "./newsRoutes.js";
import simulationRoutes from "./simulationRoutes.js";

const router = express.Router();

router.use("/news", newsRoutes);
router.use("/simulation", simulationRoutes);

export default router;