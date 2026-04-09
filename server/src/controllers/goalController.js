import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { createGoalPlan, getUserGoals } from "../services/goalService.js";

export const createGoal = async (req, res, next) => {
  try {
    const { targetAmount, years, months, riskLevel } = req.body;

    if (!targetAmount || !riskLevel || (!years && !months)) {
      return sendError(res, 400, "targetAmount, riskLevel, and years/months are required");
    }

    if (!["low", "medium", "high"].includes(riskLevel)) {
      return sendError(res, 400, "riskLevel must be low, medium, or high");
    }

    const result = await createGoalPlan({
    targetAmount: Number(targetAmount),
    years: years ? Number(years) : null,
    months: months ? Number(months) : null,
    riskLevel,
    userId: req.user.id,
    userToken: req.headers.authorization.split(" ")[1],  // ADD THIS LINE
    });

    return sendSuccess(res, 201, "Investment plan created", result);
  } catch (error) {
    next(error);
  }
};

export const getGoals = async (req, res, next) => {
  try {
    const goals = await getUserGoals(req.user.id);
    return sendSuccess(res, 200, "Goals fetched successfully", goals);
  } catch (error) {
    next(error);
  }
};