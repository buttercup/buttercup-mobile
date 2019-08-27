import { createAction } from "redux-actions";
import {
    GOOGLEDRIVE_RESET_AUTH,
    GOOGLEDRIVE_SET_AUTHENTICATED,
    GOOGLEDRIVE_SET_AUTHENTICATING,
    GOOGLEDRIVE_SET_AUTH_TOKEN,
    GOOGLEDRIVE_SET_REFRESH_TOKEN
} from "./types.js";

export const resetGoogleDriveAuth = createAction(GOOGLEDRIVE_RESET_AUTH);
export const setGoogleDriveAuthenticated = createAction(GOOGLEDRIVE_SET_AUTHENTICATED);
export const setGoogleDriveAuthenticating = createAction(GOOGLEDRIVE_SET_AUTHENTICATING);
export const setGoogleDriveAuthToken = createAction(GOOGLEDRIVE_SET_AUTH_TOKEN);
export const setGoogleDriveRefreshToken = createAction(GOOGLEDRIVE_SET_REFRESH_TOKEN);
