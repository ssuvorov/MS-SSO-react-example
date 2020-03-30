import React, { useState, useEffect } from "react";
import {
    registerRedirectionCallback,
    getAccount,
    login,
    logout,
    getAccessToken
} from "./auth-utils";

export default WrappedComponent =>
    function AuthProvider(props) {
        const [account, setAccount] = useState(null);

        const [error, setError] = useState(null);
        useEffect(() => {
            registerRedirectionCallback(setError);

            const account = getAccount();

            setAccount(account);

            if (account) {
                getAccessToken().then(accessToken => {
                    if (accessToken) {
                        console.log(accessToken);
                    }
                });
            } else {
                login();
            }
        }, []);

        return (
            <WrappedComponent
                {...props}
                account={account}
                error={error}
                onSignOut={logout}
            />
        );
    };
