const core = require("../models/core.server.models");
const users = require("../models/user.server.models");
const Joi = require("joi");

const { containsProfanity } = require("../../lib/profanity");

const get_categories = (req, res) => {
  core.getCategories((err, cats) => {
    if (err) return res.sendStatus(500);
    return res.status(200).json(cats);
  });
};

const create_item = (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
    starting_bid: Joi.number().min(1).required(),
    end_date: Joi.number().required(),

    category_ids: Joi.array().items(Joi.number().integer().min(1)).optional(),
  }).options({ allowUnknown: false });

  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({ error_message: error.details[0].message });

  // Profanity filter
  const badName = containsProfanity(req.body.name);
  const badDesc = containsProfanity(req.body.description);

  if (badName || badDesc) {
    return res.status(400).json({ error_message: "Profanity is not allowed" });
  }

  // Ensure end_date is not in the past (SECONDS)
  if (req.body.end_date < Math.floor(Date.now() / 1000)) {
    return res
      .status(400)
      .json({ error_message: "End date can't be in the past" });
  }

  const itemData = {
    name: req.body.name,
    description: req.body.description,
    starting_bid: req.body.starting_bid,
    end_date: req.body.end_date,
    creator_id: req.user_id,
  };

  core.createItem(itemData, (err, item_id) => {
    if (err) return res.sendStatus(500);

    const category_ids = req.body.category_ids || [];

    core.setItemCategories(item_id, category_ids, (err) => {
      if (err) return res.sendStatus(500);
      return res.status(201).json({ item_id });
    });
  });
};

const get_an_item = (req, res) => {
  const item_id = parseInt(req.params.item_id);

  core.getItemById(item_id, (err, item) => {
    if (err) return res.sendStatus(500);
    if (!item) return res.sendStatus(404);

    users.getUserById(item.creator_id, (err, creator) => {
      if (err) return res.sendStatus(500);

      core.getBidHistory(item_id, (err, bids) => {
        if (err) return res.sendStatus(500);

        let current_bid = item.starting_bid;
        let current_bid_holder = null;

        if (bids.length > 0) {
          const topBid = bids[0];
          current_bid = topBid.amount;
          current_bid_holder = {
            user_id: topBid.user_id,
            first_name: topBid.first_name,
            last_name: topBid.last_name,
          };
        }

        const response = {
          ...item,
          first_name: creator.first_name,
          last_name: creator.last_name,
          current_bid,
          current_bid_holder,
        };

        return res.status(200).json(response);
      });
    });
  });
};

const search_item = (req, res) => {
  const q = req.query.q || "";
  const status = req.query.status;
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const user_id = req.user_id || null;

  // Extension Task 2: category filter
  const category_ids = req.query.category_ids
    ? req.query.category_ids
        .split(",")
        .map((n) => parseInt(n))
        .filter((n) => !isNaN(n))
    : [];

  core.searchItems(
    q,
    status,
    limit,
    offset,
    user_id,
    category_ids,
    (err, results) => {
      if (err) {
        if (err.code === 400) {
          return res.status(400).json({ error_message: err.message });
        }
        return res.sendStatus(500);
      }
      return res.status(200).json(results);
    }
  );
};

const place_bid = (req, res) => {
  const item_id = parseInt(req.params.item_id);

  const schema = Joi.object({
    amount: Joi.number().min(1).required(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({ error_message: error.details[0].message });

  core.getItemById(item_id, (err, item) => {
    if (err) return res.sendStatus(500);
    if (!item) return res.sendStatus(404);
    if (item.creator_id === req.user_id) return res.sendStatus(403);

    const newAmount = req.body.amount;

    core.getHighestBid(item_id, (err, currentBid) => {
      if (err) return res.sendStatus(500);
      if (newAmount <= currentBid) {
        return res.status(400).json({
          error_message: `Bid must be higher than the current bid (${currentBid})`,
        });
      }

      core.placeBid(
        item_id,
        req.user_id,
        newAmount,
        Math.floor(Date.now() / 1000), // SECONDS
        (err) => {
          if (err) return res.sendStatus(500);
          return res.sendStatus(201);
        }
      );
    });
  });
};

const bid_history = (req, res) => {
  const item_id = parseInt(req.params.item_id);

  core.getItemById(item_id, (err, item) => {
    if (err) return res.sendStatus(500);
    if (!item) return res.sendStatus(404);

    core.getBidHistory(item_id, (err, bids) => {
      if (err) return res.sendStatus(500);
      return res.status(200).json(bids);
    });
  });
};

module.exports = {
  get_categories,
  create_item,
  get_an_item,
  search_item,
  place_bid,
  bid_history,
};
