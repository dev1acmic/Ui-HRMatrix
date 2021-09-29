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
  // fax: {
  //   presence: { allowEmpty: false, message: "is required" },
  //   format: {
  //     pattern: /[\+? *[1-9]+]?[0-9 ]+/
  //   }
  // },
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
