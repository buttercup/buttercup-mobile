import { createAction } from "redux-actions";
import {
    DROPBOX_RESET_AUTH,
    DROPBOX_SET_AUTHENTICATED,
    DROPBOX_SET_AUTHENTICATING,
    DROPBOX_SET_AUTH_TOKEN
} from "./types.js";

export const resetDropboxAuth =                 createAction(DROPBOX_RESET_AUTH);
export const setDropboxAuthenticated =          createAction(DROPBOX_SET_AUTHENTICATED);
export const setDropboxAuthenticating =         createAction(DROPBOX_SET_AUTHENTICATING);
export const setDropboxAuthToken =              createAction(DROPBOX_SET_AUTH_TOKEN);
