import React, { useEffect } from "react";
import {
  getAccount,
  login,
  logout,
  registerRedirectionCallback
} from "./auth-utils";

export default WrappedComponent =>
  function AuthProvider(props) {
    const account = getAccount();

    useEffect(() => {
      registerRedirectionCallback();

      if (!account) {
        login();
      }
    }, [account]);

    return <WrappedComponent {...props} account={account} onSignOut={logout} />;
  };
