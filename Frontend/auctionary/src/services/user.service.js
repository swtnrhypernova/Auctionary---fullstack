import http from "./http";
import { getApiErrorMessage } from "./errors";

const login = (email, password) => {
  return http
    .post("/login", { email, password })
    .then((res) => res.data)
    .catch((err) => {
      const status = err?.response?.status;
      if (status === 400) throw getApiErrorMessage(err, "Bad request");
      throw "Something went wrong";
    });
};

const register = (first_name, last_name, email, password) => {
  return http
    .post("/users", { first_name, last_name, email, password })
    .then((res) => res.data)
    .catch((err) => {
      const status = err?.response?.status;
      if (status === 400) throw getApiErrorMessage(err, "Bad request");
      throw "Something went wrong";
    });
};

const logout = () => {
  return http
    .post("/logout")
    .then(() => true)
    .catch((err) => {
      const status = err?.response?.status;
      if (status === 401 || status === 403) return true;
      throw "Something went wrong";
    });
};

const getUserDetails = (user_id) => {
  return http
    .get(`/users/${user_id}`)
    .then((res) => res.data)
    .catch((err) => {
      const status = err?.response?.status;
      if (status === 404) throw "User not found";
      throw "Something went wrong";
    });
};

export const userService = { login, register, logout, getUserDetails };
