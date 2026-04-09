import { sendError, sendSuccess } from "../utils/apiResponse.js";
import { validateSignupInput, validateLoginInput } from "../utils/validators.js";
import { signupUser, loginUser } from "../services/authService.js";

export const signup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const { isValid, errors } = validateSignupInput({ fullName, email, password });

    if (!isValid) {
      return sendError(res, 400, "Validation failed", errors);
    }

    const result = await signupUser({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password
    });

    return sendSuccess(res, 201, "Signup successful", {
      user: result.user,
      session: result.session,
      needsEmailConfirmation: !result.session
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { isValid, errors } = validateLoginInput({ email, password });

    if (!isValid) {
      return sendError(res, 400, "Validation failed", errors);
    }

    const result = await loginUser({
      email: email.trim().toLowerCase(),
      password
    });

    return sendSuccess(res, 200, "Login successful", {
      user: result.user,
      session: result.session
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, "User fetched successfully", {
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};