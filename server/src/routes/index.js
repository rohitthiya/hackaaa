import express from "express";
import authRoutes from "./authRoutes.js";
import goalRoutes from "./goalRoutes.js";  

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/goals", goalRoutes);

export default router;