import client from "../feathersApi";
import { errorHandler } from "../error/action";
import store from "store";

client.service("notifications").on("created", message => {
  console.log("new message arrived");
  console.log("created", message);
  store.dispatch({
    type: "NEW_NOTIFICATION_ARRIVED",
    data: message
  });
});

export const getNotifications = (userId, pageNo = 1) => async dispatch => {
  try {
    const res = await client.service("notifications").find({
      query: {
        $limit: 10,
        $skip: pageNo - 1,
        $sort: {
          isRead: 1,
          createdAt: -1
        },
        createdFor: userId
      }
    });
    if (res) {
      dispatch({
        type: "NOTIFICATION_LIST",
        data: res
      });
      return true;
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const setNotificationToRead = id => async dispatch => {
  try {
    const res = await client.service("notifications").patch(id, {
      isRead: true
    });
    if (res) {
      dispatch({
        type: "READ_NOTIFICATION",
        data: { id: id }
      });
      return true;
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const setAllNotificationToRead = userId => async dispatch => {
  try {
    const res = await client.service("notifications").patch(
      null,
      {
        isRead: true
      },
      { query: { createdFor: userId, isRead: false } }
    );
    if (res) {
      dispatch({
        type: "READ_ALL_NOTIFICATIONS",
        data: null
      });
      return true;
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const clearNewNotification = () => async dispatch => {
  try {
    dispatch({
      type: "CLEAR_NEW_NOTIFICATION",
      data: null
    });
    return true;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};
