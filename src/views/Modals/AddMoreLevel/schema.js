export default {
  question: { presence: { allowEmpty: false } },
  level: {
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
    },
  },
};
