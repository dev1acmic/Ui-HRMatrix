export default {
  fname: {
    presence: { allowEmpty: false, message: "is required" }
  },
  lname: {
    presence: { allowEmpty: false, message: "is required" }
  },
  username: {
    presence: { allowEmpty: false, message: "is required" },
    email: true
  }
};
