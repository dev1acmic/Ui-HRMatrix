import React, { Suspense } from "react";
import { Route } from "react-router-dom";

const UnprotectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <Suspense fallback="...loading">
          <Component {...props} />
        </Suspense>
      )}
    />
  );
};

export default UnprotectedRoute;
