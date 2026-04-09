import { getUserFromToken } from "../services/authService.js";
import { sendError } from "../utils/apiResponse.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, 401, "Authorization token missing");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return sendError(res, 401, "Authorization token missing");
    }

    const user = await getUserFromToken(token);
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};