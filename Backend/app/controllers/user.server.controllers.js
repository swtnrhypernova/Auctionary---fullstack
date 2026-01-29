const users = require("../models/user.server.models");
const Joi = require("joi");

const create_account = (req, res) => {
  const schema = Joi.object({
    first_name: Joi.string().trim().min(1).required(),
    last_name: Joi.string().trim().min(1).required(),
    email: Joi.string().email().trim().min(1).required(),
    password: Joi.string()
      .trim()
      .min(8)
      .max(64)
      .pattern(/[0-9]/, "numbers")
      .pattern(/[A-Z]/, "uppercase")
      .pattern(/[a-z]/, "lowercase")
      .pattern(/[!@#$%^&*(),.?":{}|<>]/, "special")
      .required(),
  }).options({ allowUnknown: false });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error_message: error.details[0].message });
  }

  let user_data = Object.assign({}, req.body);

  users.getUserByEmail(user_data.email, (err, existingUser) => {
    if (err) return res.sendStatus(500);
    if (existingUser)
      return res.status(400).json({ error_message: "Email already exists" });

    users.addNewUser(user_data, (err, id) => {
      if (err) return res.sendStatus(500);
      return res.status(201).send({ user_id: id });
    });
  });
};

const login = (req, res) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error_message: error.details[0].message });
  }

  users.authenticateUser(req.body.email, req.body.password, (err, id) => {
    if (err === 404)
      return res
        .status(400)
        .json({ error_message: "Invalid email/password given" });
    if (err) return res.sendStatus(500);

    users.getToken(id, (err, token) => {
      if (err) return res.sendStatus(500);

      if (token) {
        return res.status(200).send({ user_id: id, session_token: token });
      } else {
        users.setToken(id, (err, token) => {
          if (err) return res.sendStatus(500);
          return res.status(200).send({ user_id: id, session_token: token });
        });
      }
    });
  });
};

const logout = (req, res) => {
  const token = req.get("X-Authorization");
  if (!token) return res.sendStatus(401);

  users.removeToken(token, (err) => {
    if (err) return res.sendStatus(500);
    return res.sendStatus(200);
  });
};

const get_user_details = (req, res) => {
  const targetUserID = parseInt(req.params.user_id);

  users.getUserById(targetUserID, (err, user) => {
    if (err) return res.sendStatus(500);
    if (!user) return res.sendStatus(404);

    users.getItemsByUserId(targetUserID, (err, items) => {
      if (err) return res.sendStatus(500);

      users.getBidsByUserId(targetUserID, (err, bids) => {
        if (err) return res.sendStatus(500);

        return res.status(200).json({
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          selling: items || [],
          bidding_on: bids || [],
          auctions_ended: [],
        });
      });
    });
  });
};

module.exports = {
  create_account,
  login,
  logout,
  get_user_details,
};
