import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { removeError } from "services/error/action";

class RouteContainer extends Component {
  componentWillMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      if (location.pathname !== "/sign-in") {
        // sigin page message not cleared on route change in sign-in to avoid
        // removing error msg when redirected, after authfailure, to sigin page from with in the app
        removeError();
      }
      //console.log("routeChange", location.pathname);
    });
  }
  componentWillUnmount() {
    this.unlisten();
  }
  render() {
    return <div>{this.props.children}</div>;
  }
}
export default withRouter(RouteContainer);
