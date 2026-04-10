export const validateQuery = (query) => {
  if (!query || typeof query !== "string" || query.trim() === "") {
    return { isValid: false, error: "Query parameter is required" };
  }
  return { isValid: true };
};

export const validateSignupInput = ({ fullName, email, password }) => {
  const errors = {};

  if (!fullName || fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "A valid email address is required";
  }

  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateLoginInput = ({ email, password }) => {
  const errors = {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "A valid email address is required";
  }

  if (!password || password.length === 0) {
    errors.password = "Password is required";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};
