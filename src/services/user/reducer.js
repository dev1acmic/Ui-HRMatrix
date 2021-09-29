export default (state = {}, action) => {
  switch (action.type) {
    case "REGISTER":
      return {
        ...state,
        uid: action.uid
      };

    case "LOGOUT":
      return {};

    default:
      return state;
  }
};
