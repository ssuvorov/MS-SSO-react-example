import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getAccount, login, registerRedirectionCallback } from "../auth-utils";

function Login() {
  const history = useHistory();
  const location = useLocation();
  const prevLocation = window.localStorage.getItem("prevLocation");

  const { from } = prevLocation
    ? { from: { pathname: prevLocation } }
    : location.state || { from: { pathname: "/" } };

  if (!prevLocation) {
    window.localStorage.setItem("prevLocation", from);
  }

  const account = getAccount();

  useEffect(() => {
    registerRedirectionCallback(() => {
      //
    });

    if (!account) {
      login();
    }

    if (account) {
      window.localStorage.removeItem("prevLocation");
      history.replace(from);
    }
  }, [account]);

  return null; //account ? <Redirect to={from} /> : null;
}

export default Login;
