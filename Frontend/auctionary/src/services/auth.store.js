const TOKEN_KEY = "session_token";
const USER_ID_KEY = "user_id";

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (token) => {
  if (!token) localStorage.removeItem(TOKEN_KEY);
  else localStorage.setItem(TOKEN_KEY, token);
};

const getUserId = () => {
  const raw = localStorage.getItem(USER_ID_KEY);
  return raw ? Number(raw) : null;
};

const setUserId = (userId) => {
  if (userId === null || userId === undefined)
    localStorage.removeItem(USER_ID_KEY);
  else localStorage.setItem(USER_ID_KEY, String(userId));
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
};

export const authStore = {
  getToken,
  setToken,
  getUserId,
  setUserId,
  clearSession,
};
