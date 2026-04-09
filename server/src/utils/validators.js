export const validateQuery = (query) => {
  if (!query || typeof query !== "string" || query.trim() === "") {
    return { isValid: false, error: "Query parameter is required" };
  }
  return { isValid: true };
};
