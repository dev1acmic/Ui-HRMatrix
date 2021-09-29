export default {
  fname: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 32,
    },
  },
  lname: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 32,
    },
  },
  username: {
    presence: { allowEmpty: false, message: "is required" },
    email: true,
    length: {
      maximum: 64,
    },
  },
  roleId: {
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
    },
  },
  // status: {
  //   numericality: {
  //     onlyInteger: true,
  //     greaterThan: 0
  //   }
  // }
};
