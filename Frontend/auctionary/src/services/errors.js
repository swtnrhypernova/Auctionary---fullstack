export const getApiErrorMessage = (err, fallback = "Something went wrong") => {
  const msg = err?.response?.data?.error_message;
  if (typeof msg === "string" && msg.trim()) return msg;
  return fallback;
};

// note to self: removes any repeated boilerplates in every service
