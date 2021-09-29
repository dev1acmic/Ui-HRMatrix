export default {
  name: {
    presence: { allowEmpty: false, message: "is required" }
  },
  contactNo1: {
    presence: { allowEmpty: false, message: "is required" },
    format: {
      pattern: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
    }
  },
  email: {
    presence: { allowEmpty: false, message: "is required" },
    email: true
  },
  line1: {
    presence: { allowEmpty: false, message: "is required" }
  },
  city: {
    presence: { allowEmpty: false, message: "is required" }
  },
  state: {
    presence: { allowEmpty: false, message: "is required" }
  },
  zip: {
    presence: { allowEmpty: false, message: "is required" },
    format: {
      pattern: /^\d{5}$/
    }
  },
  status: {
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
    },
  },

  trialPeriod: {
    presence: { allowEmpty: false, message: "is required" },
    numericality: {
      onlyInteger: true,
    }
  }
};
