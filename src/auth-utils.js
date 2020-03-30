import { UserAgentApplication } from "msal";

export const GRAPH_SCOPES = {
    OPENID: "openid",
    PROFILE: "profile",
    USER_READ: "User.Read"
};

const config = {
    auth: {
        clientId: process.env.REACT_APP_MS_AZURE_CLIENT_ID,
        authority: `https://login.microsoftonline.com/common`,
        validateAuthority: true,
        postLogoutRedirectUri: window.location.origin, // with '/' issue to logout. Must be absolute URI
        navigateToLoginRequestUrl: false
    }
};

const GRAPH_REQUESTS = {
    LOGIN: {
        scopes: [
            GRAPH_SCOPES.OPENID,
            GRAPH_SCOPES.PROFILE,
            GRAPH_SCOPES.USER_READ
        ]
    }
};

const auth = new UserAgentApplication(config);

const requiresInteraction = errorMessage => {
    if (!errorMessage || !errorMessage.length) {
        return false;
    }

    return (
        errorMessage.indexOf("consent_required") > -1 ||
        errorMessage.indexOf("interaction_required") > -1 ||
        errorMessage.indexOf("login_required") > -1
    );
};

function setTokenRedirectToLocalStorage(req) {
    auth.acquireTokenSilent(req)
        .then(function(response) {
            window.localStorage.setItem("token", response.accessToken);
        })
        .catch(function(error) {
            //
        });
}

export function registerRedirectionCallback(errorCallback) {
    return auth.handleRedirectCallback((error, response) => {
        if (getAccount()) {
            setTokenRedirectToLocalStorage(GRAPH_REQUESTS.LOGIN);
        } else if (response.tokenType === "access_token") {
            //
        } else {
            //
        }

        if (error && errorCallback) {
            const errorMessage = error.errorMessage
                ? error.errorMessage
                : "Unable to acquire access token.";

            errorCallback(error);
        }
    });
}

export function getAccount() {
    return auth.getAccount();
}

export const getAccessToken = async () => {
    // Get the access token silently
    // If the cache contains a non-expired token, this function
    // will just return the cached token. Otherwise, it will
    // make a request to the Azure OAuth endpoint to get a token
    try {
        const token = window.localStorage.getItem("token");

        if (!token) {
            return await auth.acquireTokenSilent(GRAPH_REQUESTS.LOGIN);
        }

        return token;
    } catch (error) {
        if (requiresInteraction(error.errorCode)) {
            return auth.acquireTokenRedirect(GRAPH_REQUESTS.LOGIN);
        } else {
            console.error("Non-interactive error:", error.errorCode);
        }
    }
};

// This function is used to get to a token for Headers
export const getToken = async () => {
    const token = await getAccessToken();
    return token ? `Bearer ${token}` : "";
};

export const login = () => auth.loginRedirect(GRAPH_REQUESTS.LOGIN);

export const logout = () => auth.logout();
