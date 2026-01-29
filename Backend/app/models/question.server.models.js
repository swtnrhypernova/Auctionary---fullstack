const db = require("../../database");

const askQuestion = (item_id, user_id, question_text, done) => {
  const timestamp = Date.now();
  const sql =
    "INSERT INTO questions (item_id, asked_by, question) VALUES (?, ?, ?)";
  db.run(sql, [item_id, user_id, question_text], function (err) {
    if (err) return done(err);
    return done(null, this.lastID);
  });
};

const getQuestionsForItem = (item_id, done) => {
  const sql =
    "SELECT q.question_id, q.item_id, q.asked_by AS user_id, q.question AS question_text, q.answer AS answer_text, u.first_name, u.last_name FROM questions q JOIN users u ON q.asked_by = u.user_id WHERE q.item_id = ? ORDER BY q.question_id DESC";
  db.all(sql, [item_id], (err, rows) => {
    if (err) return done(err);
    return done(null, rows || []);
  });
};

const answerQuestion = (question_id, answer_text, done) => {
  const sql = "UPDATE questions SET answer=? WHERE question_id=?";
  db.run(sql, [answer_text, question_id], function (err) {
    if (err) return done(err);
    return done(null, this.changes);
  });
};

const getItemByQuestionId = (question_id, done) => {
  const sql =
    "SELECT q.question_id, i.creator_id AS item_creator_id FROM questions q JOIN items i ON q.item_id = i.item_id WHERE q.question_id = ?";
  db.get(sql, [question_id], (err, row) => {
    if (err) return done(err);
    return done(null, row);
  });
};

const getItemById = (item_id, done) => {
  const sql = "SELECT item_id, creator_id FROM items WHERE item_id=?";
  db.get(sql, [item_id], (err, row) => {
    if (err) return done(err);
    return done(null, row);
  });
};

module.exports = {
  askQuestion,
  getQuestionsForItem,
  answerQuestion,
  getItemByQuestionId,
  getItemById,
};
