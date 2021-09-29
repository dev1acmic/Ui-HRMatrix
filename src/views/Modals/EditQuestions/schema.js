export default {
  question: {
    presence: { allowEmpty: false }
  },
  answerType: {
    presence: { allowEmpty: false },
    numericality: {
      onlyInteger: true,
      greaterThan: 0
    }
  }
};
