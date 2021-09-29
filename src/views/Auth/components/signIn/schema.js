export default {
  email: {
    presence: { allowEmpty: false, message: 'TRANSLATION.emailReq' },
    email: { required: true, message: 'TRANSLATION.emailisnotavalidemail' },
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'TRANSLATION.pswdReq' },
    length: {
      maximum: 128
    }
  }
};
