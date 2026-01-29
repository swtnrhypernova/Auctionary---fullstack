const users = require("../app/models/user.server.models");

const authenticate = (req, res, next) => {
  const token = req.get("X-Authorization");
  if (!token) return res.sendStatus(401);

  users.getIDFromToken(token, (err, user_id) => {
    if (err === 404) return res.sendStatus(401);
    if (err) return res.sendStatus(500);

    req.user_id = user_id;
    next();
  });
};

const searchAuth = (req, res, next) => {
  const token = req.get("X-Authorization");

  if (!token) {
    req.user_id = null;
    return next();
  }

  users.getIDFromToken(token, (err, user_id) => {
    if (err === 404) {
      req.user_id = null;
      return next();
    }
    if (err) return res.sendStatus(500);

    req.user_id = user_id;
    next();
  });
};

module.exports = { authenticate, searchAuth };
