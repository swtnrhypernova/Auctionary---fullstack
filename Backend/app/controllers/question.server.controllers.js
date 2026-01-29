const questions = require("../models/question.server.models");
const Joi = require("joi");
const { containsProfanity } = require("../../lib/profanity");

const ask_question_for_item = (req, res) => {
  if (!req.user_id) return res.sendStatus(401);

  const item_id = parseInt(req.params.item_id);

  const schema = Joi.object({
    question_text: Joi.string().min(1).required(),
  }).strict();
  const { error } = schema.validate(req.body, { allowUnknown: false });
  if (error)
    return res.status(400).json({ error_message: error.details[0].message });

  if (containsProfanity(req.body.question_text)) {
    return res.status(400).json({ error_message: "Profanity is not allowed" });
  }

  questions.getItemById(item_id, (err, item) => {
    if (err) return res.sendStatus(500);
    if (!item) return res.sendStatus(404);
    if (item.creator_id === req.user_id) return res.sendStatus(403);

    questions.askQuestion(
      item_id,
      req.user_id,
      req.body.question_text,
      (err, question_id) => {
        if (err) return res.sendStatus(500);
        res.status(200).json({ question_id });
      }
    );
  });
};

const get_questions_for_item = (req, res) => {
  const item_id = parseInt(req.params.item_id);

  questions.getItemById(item_id, (err, item) => {
    if (err) return res.sendStatus(500);
    if (!item) return res.sendStatus(404);

    questions.getQuestionsForItem(item_id, (err, rows) => {
      if (err) return res.sendStatus(500);
      res.status(200).json(rows || []);
    });
  });
};

const answer_for_question = (req, res) => {
  const question_id = parseInt(req.params.question_id);

  const schema = Joi.object({
    answer_text: Joi.string().min(1).required(),
  }).strict();
  const { error } = schema.validate(req.body, { allowUnknown: false });
  if (error)
    return res.status(400).json({ error_message: error.details[0].message });

  if (containsProfanity(req.body.answer_text)) {
    return res.status(400).json({ error_message: "Profanity is not allowed" });
  }

  questions.getItemByQuestionId(question_id, (err, row) => {
    if (err) return res.sendStatus(500);
    if (!row) return res.sendStatus(404);
    if (row.item_creator_id !== req.user_id) return res.sendStatus(403);

    questions.answerQuestion(question_id, req.body.answer_text, (err) => {
      if (err) return res.sendStatus(500);
      res.sendStatus(200);
    });
  });
};

module.exports = {
  ask_question_for_item,
  get_questions_for_item,
  answer_for_question,
};
