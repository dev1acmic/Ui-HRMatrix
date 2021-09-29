export default (state = {}, action) => {
  switch (action.type) {
    case "SHOW_ERROR":
      let { message, code, name, className, data, errors } = action.data;
      // console.log(process.env);
      if (message === "Socket connection timed out") {
        message = "Sorry, failed to connect server";
      }
      if (name === "Timeout") {
        message = "Sorry, server request timed out";
      }
      return {
        message,
        code,
        name,
        className,
        data: { ...data },
        errors: { ...errors },
      };
    case "REMOVE_ERROR":
      return {
        ...action.data,
      };
    default:
      return state;
  }
};
