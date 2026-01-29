import axios from "axios";
import { authStore } from "./auth.store";

const http = axios.create({
  baseURL: "http://localhost:3333",
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  const token = authStore.getToken();
  if (token) config.headers["X-Authorization"] = token;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;

    if (status === 401 || status === 403) {
      authStore.clearSession();
    }

    return Promise.reject(err);
  }
);

export default http;
