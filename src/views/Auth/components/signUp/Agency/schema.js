import { Translation } from "react-i18next";

export default {
  fname: {
    presence: { allowEmpty: false, message: "TRANSLATION.fnrequired" },
    length: {
      maximum: 32,
      message: "TRANSLATION.fnNotValid",
    },
  },
  lname: {
    presence: { allowEmpty: false, message: "TRANSLATION.lnrequired" },
    length: {
      maximum: 32,
      message: "TRANSLATION.lnNotValid",
    },
  },
  username: {
    presence: { allowEmpty: false, message: "TRANSLATION.usernameisrequired" },
    email: { required: true, message: 'TRANSLATION.usernamenotavalidemail' },
    length: {
      maximum: 64,
    },
  },
  phoneNumber: {
    presence: { allowEmpty: false, message: "TRANSLATION.phninvalid" },
    format: {
      pattern: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/, message: 'TRANSLATION.phninvalid'
    },
    length: {
      maximum: 12,
      minimum: 10,
    },
  },
  companyName: {
    presence: { allowEmpty: false, message: "TRANSLATION.companynamerequired" },
    length: {
      maximum: 75,
      minimum: 5, message: 'TRANSLATION.companynametooshort'
    },
  },
  password: {
    presence: { allowEmpty: false, message: "TRANSLATION.pswdReq" },
    length: {
      minimum: 8,
      maximum: 128, message: 'TRANSLATION.passwordtooshort'
    },
    format: {
      pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
      message: "TRANSLATION.pswdCriteria",
    },
  },
  confirm: {
    presence: { allowEmpty: false, message: "TRANSLATION.enterPswd" },
    length: {
      maximum: 128,
    },
    equality: {
      attribute: "password",
      message: "TRANSLATION.pswdNotMatch",
      comparator: (v1, v2) => {
        return v1 === v2;
      },
    },
  },
  policy: {
    presence: { allowEmpty: false, message: "is required" },
    checked: true,
  },
};
