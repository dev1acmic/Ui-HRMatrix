import React, { Component } from "react";
import { createBrowserHistory } from "history";
import store from "./store";
import { Provider } from "react-redux";
import { authenticate } from "services/user/action";
// Material helpers
import { ThemeProvider } from "@material-ui/styles";
// Theme
import theme from "./theme";
// Styles
import "react-perfect-scrollbar/dist/css/styles.css";
import "./assets/scss/index.scss";
// Routes
import Routes from "./routes";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistStore } from "redux-persist";
import Loader from "./assets/images/loader.png";
import SmallLogo from "./assets/images/logo-small.png";
import "./i18n.js";

// Browser history
const browserHistory = createBrowserHistory();

// Bind persist store with redux store
const persistor = persistStore(store);

export default class App extends Component {
  onBeforeLift = async () => {
    const res = await authenticate();
    if (res) {
      const path = browserHistory.location.pathname;
      if (path === "/" || path === "/sign-in") {
        browserHistory.push("/rc/dashboard");
      }
    }
    return true;
  };

  loader = () => {
    const loadStyle = {
      position: "absolute",
      top: "40%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      width: "75px",
      height: "75px",
    };

    return (
      <span style={loadStyle}>
        <img src={Loader} width="75" alt="loading" />
        <img src={SmallLogo} width="75" alt="loading" />
      </span>
    );
  };

  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <PersistGate
            persistor={persistor}
            onBeforeLift={() => {
              return this.onBeforeLift();
            }}
            loading={this.loader()}
          >
            <Routes />
          </PersistGate>
        </ThemeProvider>
      </Provider>
    );
  }
}
