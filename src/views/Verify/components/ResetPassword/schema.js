export default {
  password: {
    presence: { allowEmpty: false, message: "TRANSLATION.pswdReq" },
    length: {
      minimum: 8,
      maximum: 128, message: 'TRANSLATION.passwordtooshort'
    },
    format: {
      pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
      message: "TRANSLATION.pswdCriteria"
    },
  },
  confirm: {
    presence: { allowEmpty: false, message: "TRANSLATION.enterPswd" },
    length: {
      maximum: 128
    },
    equality: {
      attribute: "password",
      message: "TRANSLATION.pswdNotMatch",
      comparator: (v1, v2) => {
        return v1 === v2;
      }
    }
  }
};
