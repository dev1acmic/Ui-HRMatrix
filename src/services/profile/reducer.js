export default (state = {}, action) => {
  switch (action.type) {
    case "LOGIN":
      let {
        fname,
        lname,
        id,
        organizationId,
        type,
        roles,
        email,
        notifyCount,
      } = action.profile;

      //notifyCount = 0;
      return {
        ...state,
        fname,
        lname,
        id,
        orgId: organizationId,
        type,
        roles,
        email,
        notifyCount,
      };

    case "NEW_NOTIFICATION_ARRIVED":
      let { notifyCount: count } = state;
      count = count + 1;
      return {
        ...state,
        notifyCount: count,
      };

    case "READ_NOTIFICATION":
      let { notifyCount: count1 } = state;
      if (count1 > 0) {
        count1 = count1 - 1;
      }
      return {
        ...state,
        notifyCount: count1,
      };

    case "READ_ALL_NOTIFICATIONS":
      return {
        ...state,
        notifyCount: 0,
      };

    default:
      return state;
  }
};
