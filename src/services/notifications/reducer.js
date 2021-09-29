export default (state = {}, action) => {
  switch (action.type) {
    case "NOTIFICATION_LIST":
      let { total, skip, data } = action.data;

      if (skip !== 0) {
        data = state.list.concat(data);
      }
      const notifications = createCopy(data, null, false);

      return {
        ...state,
        list: notifications,
        total: total
      };

    case "READ_NOTIFICATION":
      const { id } = action.data;
      const list1 = state.list;
      const notifications1 = createCopy(list1, id, false);

      return {
        ...state,
        list: notifications1
      };

    case "READ_ALL_NOTIFICATIONS":
      const list2 = state.list;
      const notifications2 = createCopy(list2, null, true);
      return {
        ...state,
        list: notifications2
      };

    case "NEW_NOTIFICATION_ARRIVED":
      const {
        id: messageId,
        message,
        category,
        createdAt,
        createdFor,
        isRead,
        params
      } = action.data;
      return {
        ...state,
        newMessage: {
          id: messageId,
          message,
          category,
          createdAt,
          createdFor,
          isRead,
          params
        }
      };

    case "CLEAR_NEW_NOTIFICATION":
      return {
        ...state,
        newMessage: null
      };

    default:
      return state;
  }
};

const createCopy = (notifications, notificaionId, allRead) => {
  return notifications.map(item => {
    let { id, message, category, createdAt, createdFor, isRead, params } = item;

    if (allRead) {
      isRead = true;
    }
    if (notificaionId && notificaionId === id) {
      isRead = true;
    }
    return { id, message, category, createdAt, createdFor, isRead, params };
  });
};
