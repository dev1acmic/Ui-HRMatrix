import store from "../../store";

export const errorHandler = async (err) => {
  let { message } = err;

  switch (err.code) {
    case 401: // auth failed
      if (err.data) {
        if (err.data.name === "JsonWebTokenError") {
          message = "TRANSLATION.errMsg.inValidSession";
        } else if (err.data.name === "TokenExpiredError") {
          message = "TRANSLATION.errMsg.sessionExpired";
        } else {
          message = "TRANSLATION.errMsg.plsLogin";
        }
      }

      localStorage.removeItem("feathers-jwt");
      localStorage.removeItem("persist:root");
      await store.dispatch({
        type: "LOGOUT",
      });

      break;
    case 400: //validation error
      if (err.errors && err.errors[0]) {
        const error = err.errors[0];
        if (
          error.message === "username must be unique" ||
          "users.username must be unique"
        ) {
          message = "TRANSLATION.errMsg.emailExists";
        }
      }
      break;
    case 404: // server error
      message = "TRANSLATION.errMsg.oops";
      break;
    case 408: // timesout
      message = "TRANSLATION.errMsg.requestTimeout";
      break;
    default:
      break;
  }

  store.dispatch({
    type: "SHOW_ERROR",
    data: { ...err, message },
  });
};

export const removeError = () => {
  return store.dispatch({
    type: "REMOVE_ERROR",
    data: {},
  });
};
