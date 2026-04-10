// src/routes/profileRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  fetchProfile,
  updateProgress,
  completeProfile,
  deferProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.use(protect); // All profile routes require auth

router.get("/", fetchProfile);
router.post("/progress", updateProgress);
router.post("/complete", completeProfile);
router.post("/defer", deferProfile);

export default router;
