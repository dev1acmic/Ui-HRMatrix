export default {
  line1: {
    presence: { allowEmpty: false, message: "is required" }
  },
  // line2: {
  //   presence: { allowEmpty: false, message: "is required" }
  // },
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
  }
};
