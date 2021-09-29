export default (state = {}, action) => {
  switch (action.type) {
    case "SUBSCRIPTION":
      return {
        ...state,
        ...action.data,
      };

    case "LOAD_ORGANIZATION":
      return {
        ...state,
        ...action.data,
      };

    case "LOAD_PREMIUM_ORGANIZATIONS":
      return {
        ...state,
        premiumOrganizations: action.data,
      };

    default:
      return state;
  }
};
