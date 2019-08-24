import { Platform } from "react-native";
import { GoogleSignin } from "react-native-google-signin";
import { OAuth2Client } from "@buttercup/google-oauth2-client";
import { dispatch, getState } from "../store.js";
import {
    setGoogleDriveAuthenticating,
    setGoogleDriveAuthenticated,
    setGoogleDriveAuthCode,
    setGoogleDriveAuthToken,
    setGoogleDriveRefreshToken
} from "../actions/googleDrive.js";
import secrets from "../../secrets.json";

export async function authenticate() {
    const { googleDriveClientID } = Platform.select(secrets);
    // Configure google auth
    GoogleSignin.configure({
        scopes: ["email", "profile", "https://www.googleapis.com/auth/drive"],
        webClientId: googleDriveClientID,
        offlineAccess: true,
        forceConsentPrompt: true,
        iosClientId: googleDriveClientID
    });
    // Reset state
    dispatch(setGoogleDriveAuthenticating(true));
    dispatch(setGoogleDriveAuthenticated(false));
    dispatch(setGoogleDriveAuthToken(null));
    dispatch(setGoogleDriveRefreshToken(null));
    try {
        // Authenticate
        if (await GoogleSignin.isSignedIn()) {
            await GoogleSignin.signOut();
        }
        const { serverAuthCode } = await GoogleSignin.signIn();
        const oauth2Client = new OAuth2Client(googleDriveClientID, null, null);
        const { tokens } = await oauth2Client.getToken(serverAuthCode);
        dispatch(setGoogleDriveAuthToken(tokens.access_token));
        dispatch(setGoogleDriveRefreshToken(tokens.refresh_token));
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
    dispatch(setGoogleDriveAuthToken(null));
    dispatch(setGoogleDriveRefreshToken(null));
    const oauth2Client = new OAuth2Client(googleDriveClientID, null, null);
    const { tokens } = await oauth2Client.refreshToken(refreshToken);
    const newRefreshToken = tokens.refresh_token || refreshToken;
    dispatch(setGoogleDriveAuthToken(tokens.access_token));
    dispatch(setGoogleDriveRefreshToken(newRefreshToken));
    return {
        accessToken: tokens.access_token,
        refreshToken: newRefreshToken
    };
}
