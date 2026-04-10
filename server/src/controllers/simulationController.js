import { simulateInvestment } from "../services/simulationService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

const VALID_TYPES = ["stocks", "mutual", "fd", "crypto"];

export const runSimulation = async (req, res, next) => {
  try {
    const { amount, duration, investmentType } = req.body;

    // Validate presence
    if (!amount || !duration || !investmentType) {
      return sendError(res, 400, "amount, duration, and investmentType are required");
    }

    // Validate types
    if (!VALID_TYPES.includes(investmentType)) {
      return sendError(res, 400, `investmentType must be one of: ${VALID_TYPES.join(", ")}`);
    }

    const numAmount = Number(amount);
    const numDuration = Number(duration);

    if (isNaN(numAmount) || numAmount <= 0) {
      return sendError(res, 400, "amount must be a positive number");
    }

    if (isNaN(numDuration) || numDuration < 1 || numDuration > 360) {
      return sendError(res, 400, "duration must be between 1 and 360 months");
    }

    const result = simulateInvestment({
      amount: numAmount,
      duration: numDuration,
      investmentType,
    });

    return sendSuccess(res, 200, "Simulation completed successfully", result);
  } catch (error) {
    next(error);
  }
};