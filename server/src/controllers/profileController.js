// src/controllers/profileController.js
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import {
  getProfile,
  saveProgress,
  completeOnboarding,
  deferOnboarding,
} from "../services/profileService.js";

const getAuth = (req) => ({
  userId: req.user.id,
  userToken: req.headers.authorization?.split(" ")[1],
});

// GET /api/profile
export const fetchProfile = async (req, res, next) => {
  try {
    const { userId, userToken } = getAuth(req);
    const profile = await getProfile({ userId, userToken });
    return sendSuccess(res, 200, "Profile fetched", profile);
  } catch (err) {
    next(err);
  }
};

// POST /api/profile/progress   { step, answers, status }
export const updateProgress = async (req, res, next) => {
  try {
    const { userId, userToken } = getAuth(req);
    const { step, answers, status = "in_progress" } = req.body;

    if (step === undefined || !answers) {
      return sendError(res, 400, "step and answers are required");
    }

    const profile = await saveProgress({ userId, userToken, step, status, answers });
    return sendSuccess(res, 200, "Progress saved", profile);
  } catch (err) {
    next(err);
  }
};

// POST /api/profile/complete   { answers }
export const completeProfile = async (req, res, next) => {
  try {
    const { userId, userToken } = getAuth(req);
    const { answers } = req.body;

    if (!answers) return sendError(res, 400, "answers are required");

    const profile = await completeOnboarding({ userId, userToken, answers });
    return sendSuccess(res, 200, "Onboarding complete", profile);
  } catch (err) {
    next(err);
  }
};

// POST /api/profile/defer
export const deferProfile = async (req, res, next) => {
  try {
    const { userId, userToken } = getAuth(req);
    const profile = await deferOnboarding({ userId, userToken });
    return sendSuccess(res, 200, "Onboarding deferred", profile);
  } catch (err) {
    next(err);
  }
};
