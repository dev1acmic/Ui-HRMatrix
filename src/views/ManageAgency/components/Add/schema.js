export default {
  // contactNo1: {
  //   presence: { allowEmpty: false, message: "is required" },
  //   format: {
  //     pattern: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
  //   }
  // },
  // contactNo2: {
  //   format: {
  //     pattern: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
  //   }
  // },
  companyName: {
    presence: { allowEmpty: false, message: "is required" },
  },
  // addrLine1: {
  //   presence: { allowEmpty: false, message: "is required" }
  // },
  // addrLine2: {
  //   presence: { allowEmpty: false, message: "is required" }
  // },
  // city: {
  //   presence: { allowEmpty: false, message: "is required" }
  // },
  // state: {
  //   presence: { allowEmpty: false, message: "is required" }
  // },
  // zip: {
  //   presence: { allowEmpty: false, message: "is required" },
  //   format: {
  //     pattern: /^\d{5}$/
  //     //   // message: function(value, attribute, validatorOptions, attributes, globalOptions) {
  //     //   //   return validate.format("^%{num} is not a valid credit card number", {
  //     //   //     num: value
  //     //   //   });
  //     // }
  //   }
  // },
  fname: {
    presence: { allowEmpty: false, message: "is required" },
    // length: {
    //   maximum: 32
    // }
  },
  lname: {
    presence: { allowEmpty: false, message: "is required" },
    // length: {
    //   maximum: 32
    // }
  },
  username: {
    presence: { allowEmpty: false, message: "is required" },
    email: true,
    // length: {
    //   maximum: 64
    // }
  },
  status: {
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
    },
  },
};
