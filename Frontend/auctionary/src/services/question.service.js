import http from "./http";
import { getApiErrorMessage } from "./errors";

const getQuestionsForItem = (item_id) => {
  return http
    .get(`/item/${item_id}/question`)
    .then((res) => res.data)
    .catch((err) => {
      const status = err?.response?.status;
      if (status === 404) throw "Item not found";
      throw "Something went wrong";
    });
};

const askQuestionForItem = (item_id, question_text) => {
  return http
    .post(`/item/${item_id}/question`, { question_text })
    .then((res) => res.data) // { question_id: ... }
    .catch((err) => {
      const status = err?.response?.status;

      if (status === 400) throw getApiErrorMessage(err, "Bad request");
      if (status === 401) throw "Not logged in";
      if (status === 403) throw "You can't ask a question on your own item";
      if (status === 404) throw "Item not found";

      throw "Something went wrong";
    });
};

const answerQuestion = (question_id, answer_text) => {
  return http
    .post(`/question/${question_id}`, { answer_text })
    .then(() => true)
    .catch((err) => {
      const status = err?.response?.status;

      if (status === 400) throw getApiErrorMessage(err, "Bad request");
      if (status === 401) throw "Not logged in";
      if (status === 403) throw "Only the seller can answer questions";
      if (status === 404) throw "Question not found";

      throw "Something went wrong";
    });
};

export const questionService = {
  getQuestionsForItem,
  askQuestionForItem,
  answerQuestion,
};
