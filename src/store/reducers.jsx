/**
 * Combine All Reducers
 */

import { combineReducers } from "redux";
import user from "services/user/reducer";
import employer from "services/employer/reducer";
import jobPost from "services/jobPost/reducer";
import jobApplication from "services/jobApplication/reducer";
import profile from "services/profile/reducer";
import admin from "services/admin/reducer";
import error from "services/error/reducer";
import notifications from "services/notifications/reducer";
import organization from "services/organization/reducer";
// Combine all
const appReducer = combineReducers({
  user,
  employer,
  jobPost,
  jobApplication,
  profile,
  admin,
  notifications,
  organization,
  error,
});

// Setup root reducer
const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") {
    state = undefined;
  }
  //const newState = state;
  return appReducer(state, action);
};

export default rootReducer;

// /**
//  * Combine All Reducers
//  */
// import reduxifyServices from "feathers-redux";
// import reduxifyAuth from "feathers-reduxify-authentication";

// import { combineReducers } from "redux";
// import client from "../feathersApi";
// import * as R from "ramda";

// const serviceMap = {
//   users: "users",
//   profile: "profile", // a dummy service to hold profile data in store
//   errors: "errors", // a dummy service to hold all service errors in store
//   //employers: "employers",
//   departments: "departments",
//   jobposts: "jobposts",
//   skills: "skills",
//   jobskills: "jobskills",
//   addresses: "addresses"
//   //locations: "locations"
// };

// const auth = reduxifyAuth(client, {
//   token: "accessToken"
// });

// // Bind services with feathers-redux
// export const rawServices = {
//   ...reduxifyServices(client, serviceMap),
//   auth
// };

// // Configure service reducers
// const reducers = R.map(x => x.reducer, rawServices); // object map not array map
// export default combineReducers(reducers);
