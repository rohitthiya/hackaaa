export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateSignupInput = ({ fullName, email, password }) => {
  const errors = {};

  if (!fullName || !fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email.trim())) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLoginInput = ({ email, password }) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email.trim())) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};