import http from "./http";
import { getApiErrorMessage } from "./errors";

const searchItems = (q = "", category_ids = []) => {
  const params = {};
  if (q) params.q = q;
  if (category_ids?.length) params.category_ids = category_ids.join(",");

  return http
    .get("/search", { params })
    .then((res) => res.data)
    .catch(() => Promise.reject("Something went wrong"));
};

const searchItemsAdvanced = (
  q = "",
  status = "",
  limit = 10,
  offset = 0,
  category_ids = []
) => {
  const params = { limit, offset };
  if (q) params.q = q;
  if (status) params.status = status;
  if (category_ids?.length) params.category_ids = category_ids.join(",");

  return http
    .get("/search", { params })
    .then((res) => res.data)
    .catch((err) => {
      if (err?.response?.status === 400) {
        return Promise.reject(getApiErrorMessage(err, "Bad request"));
      }
      return Promise.reject("Something went wrong");
    });
};

const getSingleItem = (id) => {
  return http
    .get(`/item/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      if (err?.response?.status === 404) throw "Item not found";
      throw "Something went wrong";
    });
};

const getCategories = () => {
  return http
    .get("/categories")
    .then((res) => res.data)
    .catch(() => Promise.reject("Something went wrong"));
};

const createItem = (
  name,
  description,
  starting_bid,
  end_date,
  category_ids = []
) => {
  return http
    .post("/item", { name, description, starting_bid, end_date, category_ids })
    .then((res) => res.data)
    .catch((err) => {
      const status = err?.response?.status;
      if (status === 400) throw getApiErrorMessage(err, "Bad request");
      if (status === 401) throw "Not logged in";
      throw "Something went wrong";
    });
};

const getBidHistory = (item_id) => {
  return http
    .get(`/item/${item_id}/bid`)
    .then((res) => res.data)
    .catch((err) => {
      if (err?.response?.status === 404) throw "Item not found";
      throw "Something went wrong";
    });
};

const placeBid = (item_id, amount) => {
  return http
    .post(`/item/${item_id}/bid`, { amount })
    .then(() => true)
    .catch((err) => {
      const status = err?.response?.status;
      if (status === 400) throw getApiErrorMessage(err, "Bad request");
      if (status === 401) throw "Not logged in";
      if (status === 403) throw "You can't bid on your own item";
      if (status === 404) throw "Item not found";
      throw "Something went wrong";
    });
};

export const coreService = {
  searchItems,
  searchItemsAdvanced,
  getSingleItem,
  getCategories,
  createItem,
  getBidHistory,
  placeBid,
};
