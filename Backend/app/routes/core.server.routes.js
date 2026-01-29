const core = require("../controllers/core.server.controllers");
const { authenticate, searchAuth } = require("../../lib/authentication");

module.exports = function (app) {
  app.route("/search").get(searchAuth, core.search_item);

  app.route("/categories").get(core.get_categories);

  app.route("/item").post(authenticate, core.create_item);

  app.route("/item/:item_id").get(core.get_an_item);

  app
    .route("/item/:item_id/bid")
    .get(core.bid_history)
    .post(authenticate, core.place_bid);
};
