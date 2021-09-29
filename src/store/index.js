import { applyMiddleware, compose, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// All redux reducers (rolled into one mega-reducer)
import rootReducer from "./reducers";

let middleware = [
  //Analytics,
  thunk, // Allows action creators to return functions (not just plain objects)
];

//if (process.env.NODE_ENV === "development") {
// Dev-only middleware
middleware = [
  ...middleware,
  createLogger(), // Logs state changes to the dev console
];
//}
// else {
//   //let console = {};
//   //console.log = () => {};
//   //console.error = () => {};
// }

// Profile node in store should be hydrated from localstorage
const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["profile"],
};

// Bind reducer with persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

//Init redux store (using the given reducer & middleware)
const store = compose(applyMiddleware(...middleware))(createStore)(
  persistedReducer
);

export default store;
