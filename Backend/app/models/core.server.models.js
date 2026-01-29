const db = require("../../database");

const createItem = (item, done) => {
  const sql =
    "INSERT INTO items (name, description, starting_bid, start_date, end_date, creator_id) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    item.name,
    item.description,
    item.starting_bid,
    Math.floor(Date.now() / 1000),
    item.end_date,
    item.creator_id,
  ];
  db.run(sql, values, function (err) {
    if (err) return done(err);
    return done(null, this.lastID);
  });
};

const getItemById = (item_id, done) => {
  const sql =
    "SELECT item_id, name, description, starting_bid, start_date, end_date, creator_id FROM items WHERE item_id=?";
  db.get(sql, [item_id], (err, row) => {
    if (err) return done(err);
    return done(null, row);
  });
};

// ✅ Extension Task 2: get all categories
const getCategories = (done) => {
  const sql = "SELECT category_id, name FROM categories ORDER BY name ASC";
  db.all(sql, [], (err, rows) => {
    if (err) return done(err);
    return done(null, rows || []);
  });
};

// ✅ Extension Task 2: link item to categories
const setItemCategories = (item_id, category_ids, done) => {
  if (!category_ids || category_ids.length === 0) return done(null);

  const placeholders = category_ids.map(() => "(?, ?)").join(",");
  const values = [];
  category_ids.forEach((cid) => {
    values.push(item_id, cid);
  });

  const sql = `INSERT OR IGNORE INTO item_categories (item_id, category_id) VALUES ${placeholders}`;
  db.run(sql, values, function (err) {
    if (err) return done(err);
    return done(null);
  });
};

// EXTENSION: categories for a single item
const getCategoriesForItem = (item_id, done) => {
  const sql =
    "SELECT c.category_id, c.name " +
    "FROM categories c " +
    "JOIN item_categories ic ON ic.category_id = c.category_id " +
    "WHERE ic.item_id = ? " +
    "ORDER BY c.name ASC";

  db.all(sql, [item_id], (err, rows) => {
    if (err) return done(err);
    return done(null, rows || []);
  });
};

// UPDATED signature: now includes category_ids
const searchItems = (
  query,
  status,
  limit,
  offset,
  user_id,
  category_ids,
  done
) => {
  const values = [];
  let sql =
    "SELECT i.item_id, i.name, i.description, i.starting_bid, i.start_date, i.end_date, i.creator_id, u.first_name, u.last_name " +
    "FROM items i " +
    "JOIN users u ON i.creator_id = u.user_id ";

  const now = Math.floor(Date.now() / 1000);

  if (category_ids && category_ids.length > 0) {
    sql += "JOIN item_categories ic ON ic.item_id = i.item_id ";
  }

  sql += "WHERE 1=1 ";

  if (query) {
    sql += "AND i.name LIKE ? ";
    values.push(`%${query}%`);
  }

  if (status === "OPEN") {
    if (!user_id)
      return done({
        code: 400,
        message: "Authentication required for OPEN status",
      });
    sql += "AND i.end_date > ? AND i.creator_id = ? ";
    values.push(now, user_id);
  } else if (status === "BID") {
    if (!user_id)
      return done({
        code: 400,
        message: "Authentication required for BID status",
      });
    sql +=
      "AND EXISTS (SELECT 1 FROM bids b WHERE b.item_id=i.item_id AND b.user_id=?) AND i.end_date > ? ";
    values.push(user_id, now);
  } else if (status === "ARCHIVE") {
    sql += "AND i.end_date < ? ";
    values.push(now);
  } else if (status) {
    return done({ code: 400, message: "Invalid status" });
  }

  if (category_ids && category_ids.length > 0) {
    const placeholders = category_ids.map(() => "?").join(",");
    sql += `AND ic.category_id IN (${placeholders}) `;
    values.push(...category_ids);
    sql += "GROUP BY i.item_id HAVING COUNT(DISTINCT ic.category_id) = ? ";
    values.push(category_ids.length);
  }

  sql += "ORDER BY i.item_id DESC LIMIT ? OFFSET ?";
  values.push(limit || 10, offset || 0);

  db.all(sql, values, (err, rows) => {
    if (err) return done(err);
    return done(null, rows || []);
  });
};

const placeBid = (item_id, user_id, amount, timestamp, done) => {
  const sql =
    "INSERT INTO bids (item_id, user_id, amount, timestamp) VALUES (?, ?, ?, ?)";
  const values = [item_id, user_id, amount, timestamp];
  db.run(sql, values, function (err) {
    if (err) return done(err);
    return done(null, this.lastID);
  });
};

const getHighestBid = (item_id, done) => {
  const sql = "SELECT max(amount) as max_bid FROM bids WHERE item_id=?";
  db.get(sql, [item_id], (err, row) => {
    if (err) return done(err);
    if (!row || row.max_bid === null) {
      const item_sql = "SELECT starting_bid FROM items WHERE item_id=?";
      db.get(item_sql, [item_id], (err, itemRow) => {
        if (err) return done(err);
        if (!itemRow) return done(404);
        return done(null, itemRow.starting_bid);
      });
    } else {
      return done(null, row.max_bid);
    }
  });
};

const getBidHistory = (item_id, done) => {
  const sql =
    "SELECT b.item_id, b.user_id, b.amount, b.timestamp, u.first_name, u.last_name " +
    "FROM bids b JOIN users u ON b.user_id = u.user_id " +
    "WHERE b.item_id=? ORDER BY b.amount DESC";
  db.all(sql, [item_id], (err, rows) => {
    if (err) return done(err);
    return done(null, rows);
  });
};

module.exports = {
  createItem,
  getItemById,
  searchItems,
  placeBid,
  getBidHistory,
  getHighestBid,
  getCategories,
  setItemCategories,
  getCategoriesForItem,
};
