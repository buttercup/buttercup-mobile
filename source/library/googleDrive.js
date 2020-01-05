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
import secrets from "../shared/resources/google-client.json";

const GOOGLE_DRIVE_SCOPES = [
    "email",
    "profile",
    "https://www.googleapis.com/auth/drive.file" // Per-file access
];

export async function authenticate() {
    const {
        googleDriveClientID,
        googleDriveWebClientID,
        googleDriveWebClientSecret
    } = Platform.select(secrets);
    // Configure google auth
    GoogleSignin.configure({
        scopes: [...GOOGLE_DRIVE_SCOPES],
        webClientId: googleDriveWebClientID,
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
        const oauth2Client = googleDriveWebClientSecret
            ? new OAuth2Client(googleDriveWebClientID, googleDriveWebClientSecret, null)
            : new OAuth2Client(googleDriveWebClientID, null, null);
        const { tokens } = await oauth2Client.exchangeAuthCodeForToken(serverAuthCode);
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
    const { googleDriveClientID } = Platform.select(secrets);
    const oauth2Client = new OAuth2Client(googleDriveClientID, null, null);
    const { tokens } = await oauth2Client.refreshAccessToken(refreshToken);
    const newRefreshToken = tokens.refresh_token || refreshToken;
    dispatch(setGoogleDriveAuthToken(tokens.access_token));
    dispatch(setGoogleDriveRefreshToken(newRefreshToken));
    return {
        accessToken: tokens.access_token,
        refreshToken: newRefreshToken
    };
}
