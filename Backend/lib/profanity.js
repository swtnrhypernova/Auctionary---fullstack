const leo = require("leo-profanity");

function containsProfanity(text) {
  if (typeof text !== "string" || text.trim() === "") return false;
  return leo.check(text);
}

module.exports = { containsProfanity };
