export default {
  name: {
    presence: { allowEmpty: false, message: "is required" },
  },
  email: {
    presence: { allowEmpty: false, message: "is required" },
    email: true,
  },
};
