import { createAction } from "redux-actions";
import {
    GOOGLE_DRIVE_RESET_AUTH,
    GOOGLE_DRIVE_SET_AUTHENTICATED,
    GOOGLE_DRIVE_SET_AUTHENTICATING,
    GOOGLE_DRIVE_SET_AUTH_TOKEN
} from "./types.js";

export const resetGoogleDriveAuth = createAction(GOOGLE_DRIVE_RESET_AUTH);
export const setGoogleDriveAuthenticated = createAction(GOOGLE_DRIVE_SET_AUTHENTICATED);
export const setGoogleDriveAuthenticating = createAction(GOOGLE_DRIVE_SET_AUTHENTICATING);
export const setGoogleDriveAuthToken = createAction(GOOGLE_DRIVE_SET_AUTH_TOKEN);
