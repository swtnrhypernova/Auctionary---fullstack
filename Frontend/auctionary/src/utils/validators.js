// Email
export const isEmail = (value = "") => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(value).trim());
};

// Password rules
export const hasMinLength = (value = "", min = 8) => value.length >= min;
export const hasLetter = (value = "") => /[a-zA-Z]/.test(value);
export const hasNumber = (value = "") => /[0-9]/.test(value);
export const hasSymbol = (value = "") => /[^a-zA-Z0-9]/.test(value);

export const isStrongPassword = (value = "") =>
  hasMinLength(value) &&
  hasLetter(value) &&
  hasNumber(value) &&
  hasSymbol(value);

// Password strength score (0–4)
export const passwordStrengthScore = (value = "") => {
  let score = 0;
  if (hasMinLength(value)) score++;
  if (hasLetter(value)) score++;
  if (hasNumber(value)) score++;
  if (hasSymbol(value)) score++;
  return score;
};

export const passwordStrengthLabel = (value = "") => {
  if (!value.length) return "—";
  const score = passwordStrengthScore(value);
  if (score <= 1) return "Weak";
  if (score === 2) return "Medium";
  return "Strong";
};
