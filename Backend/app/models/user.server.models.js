const db = require("../../database");
const crypto = require("crypto");

const getHash = function (password, salt) {
  return crypto
    .pbkdf2Sync(password, salt, 100000, 256, "sha256")
    .toString("hex");
};

const addNewUser = (user, done) => {
  const salt = crypto.randomBytes(64);
  const hash = getHash(user.password, salt);

  const sql =
    "INSERT INTO users (first_name, last_name, email, password, salt) VALUES (?,?,?,?,?)";
  const values = [
    user.first_name,
    user.last_name,
    user.email,
    hash,
    salt.toString("hex"),
  ];

  db.run(sql, values, function (err) {
    if (err) return done(err);
    return done(null, this.lastID);
  });
};

const authenticateUser = (email, password, done) => {
  const sql = "SELECT user_id, password, salt FROM users WHERE email=?";

  db.get(sql, [email], (err, row) => {
    if (err) return done(err);
    if (!row) return done(404);

    const salt = Buffer.from(row.salt, "hex");
    if (row.password === getHash(password, salt)) {
      return done(null, row.user_id);
    } else {
      return done(404);
    }
  });
};

const setToken = (id, done) => {
  const token = crypto.randomBytes(16).toString("hex");
  const sql = "UPDATE users SET session_token=? WHERE user_id=?";
  db.run(sql, [token, id], (err) => {
    return done(err, token);
  });
};

const removeToken = (token, done) => {
  const sql = "UPDATE users SET session_token=null WHERE session_token=?";
  db.run(sql, [token], (err) => {
    return done(err);
  });
};

const getToken = (id, done) => {
  const sql = "SELECT session_token FROM users WHERE user_id=?";
  db.get(sql, [id], (err, row) => {
    if (err) return done(err);
    if (!row || !row.session_token) return done(null, null);
    return done(null, row.session_token);
  });
};

const getIDFromToken = (token, done) => {
  const sql = "SELECT user_id FROM users WHERE session_token=?";
  db.get(sql, [token], (err, row) => {
    if (err) return done(err);
    if (!row) return done(404);
    return done(null, row.user_id);
  });
};

const getUserByEmail = (email, done) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.get(sql, [email], (err, row) => {
    if (err) return done(err);
    return done(null, row);
  });
};

const getUserById = (user_id, done) => {
  const sql =
    "SELECT user_id, first_name, last_name FROM users WHERE user_id=?";
  db.get(sql, [user_id], (err, row) => {
    if (err) return done(err);
    return done(null, row);
  });
};

const getItemsByUserId = (user_id, done) => {
  const sql =
    "SELECT i.item_id, i.name, i.description, i.end_date, i.creator_id, u.first_name, u.last_name FROM items i JOIN users u ON u.user_id = i.creator_id WHERE i.creator_id = ?";
  db.all(sql, [user_id], (err, rows) => {
    if (err) return done(err);
    return done(null, rows || []);
  });
};

const getBidsByUserId = (user_id, done) => {
  const sql =
    "SELECT DISTINCT i.item_id, i.name, i.description, i.end_date, i.creator_id, u.first_name, u.last_name FROM bids b JOIN items i ON b.item_id = i.item_id JOIN users u ON u.user_id = i.creator_id WHERE b.user_id = ?";

  db.all(sql, [user_id], (err, rows) => {
    if (err) return done(err);
    return done(null, rows || []);
  });
};

module.exports = {
  addNewUser,
  authenticateUser,
  setToken,
  removeToken,
  getToken,
  getIDFromToken,
  getUserByEmail,
  getUserById,
  getItemsByUserId,
  getBidsByUserId,
};
