import watch from "redux-watch";
import { Platform } from "react-native";
import ms from "ms";
import { authorize, refresh } from "react-native-app-auth";
import store, { dispatch, getState } from "../store.js";
import { setBrowserURL } from "../actions/browser.js";
import { navigateToPopupBrowser } from "../actions/navigation.js";
import { getAuthCode } from "../selectors/googleDrive.js";
import {
    setGoogleDriveAuthenticating,
    setGoogleDriveAuthenticated,
    setGoogleDriveAuthCode,
    setGoogleDriveAuthToken,
    setGoogleDriveRefreshToken
} from "../actions/googleDrive.js";
import secrets from "../../secrets.json";

export async function authenticateWithoutToken() {
    dispatch(setGoogleDriveAuthenticating(true));
    dispatch(setGoogleDriveAuthenticated(false));
    dispatch(setGoogleDriveAuthToken(null));
    dispatch(setGoogleDriveRefreshToken(null));
    try {
        // Authenticate
        const { accessToken, refreshToken } = await authorize(getConfig());
        dispatch(setGoogleDriveAuthToken(accessToken));
        dispatch(setGoogleDriveRefreshToken(refreshToken));
        dispatch(setGoogleDriveAuthenticating(false));
        dispatch(setGoogleDriveAuthenticated(true));
    } catch (err) {
        dispatch(setGoogleDriveAuthenticating(false));
        dispatch(setGoogleDriveAuthenticated(false));
        dispatch(setGoogleDriveAuthToken(null));
        dispatch(setGoogleDriveRefreshToken(null));
        if (!/cancell?ed/i.test(err.message)) {
            throw err;
        }
    }
}

export async function authenticateWithRefreshToken(accessToken, refreshToken) {
    dispatch(setGoogleDriveAuthCode(null));
    dispatch(setGoogleDriveAuthToken(null));
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refresh(
        getConfig(),
        { refreshToken }
    );
    dispatch(setGoogleDriveAuthToken(newAccessToken));
    if (newRefreshToken) {
        dispatch(setGoogleDriveRefreshToken(newRefreshToken));
    }
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken || refreshToken
    };
}

function getConfig() {
    const { googleDriveClientID, googleDriveOAuthRedirectURL } = Platform.select(secrets);
    return {
        issuer: "https://accounts.google.com",
        clientId: googleDriveClientID,
        redirectUrl: googleDriveOAuthRedirectURL,
        scopes: ["email", "profile", "https://www.googleapis.com/auth/drive"]
    };
}
