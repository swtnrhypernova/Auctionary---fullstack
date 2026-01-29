const question = require("../controllers/question.server.controllers");
const { authenticate } = require("../../lib/authentication");

module.exports = function (app) {
  app
    .route("/item/:item_id/question")
    .get(question.get_questions_for_item)
    .post(authenticate, question.ask_question_for_item);

  app
    .route("/question/:question_id")
    .post(authenticate, question.answer_for_question);
};
