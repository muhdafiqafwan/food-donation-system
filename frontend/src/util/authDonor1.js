import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { AuthContext } from "../context/auth";

function AuthRouteDonor1({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        user.isAuth && user.role == "donor" ? (
          <Redirect to="/donorHomepage" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
}

export default AuthRouteDonor1;
