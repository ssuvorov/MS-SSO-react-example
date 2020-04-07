import React from "react";
import {
    getAccount,
    logout
} from "./auth-utils";

export default WrappedComponent =>
    function AuthProvider(props) {
        const account = getAccount();

        return (
            <WrappedComponent
                {...props}
                account={account}
                onSignOut={logout}
            />
        );
    };
