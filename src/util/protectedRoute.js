import React, { Suspense } from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("feathers-jwt");
  const isAuth = token != null;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth ? (
          <Suspense fallback="...loading">
            <Component {...props} />
          </Suspense>
        ) : (
          <Redirect
            to={{
              pathname: "/sign-in",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;
