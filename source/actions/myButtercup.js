import { createAction } from "redux-actions";
import {
    MYBUTTERCUP_RESET_AUTH,
    MYBUTTERCUP_SET_AUTHENTICATED,
    MYBUTTERCUP_SET_AUTHENTICATING,
    MYBUTTERCUP_SET_ACCESS_TOKEN,
    MYBUTTERCUP_SET_REFRESH_TOKEN
} from "./types.js";

export const resetMyButtercupAuth = createAction(MYBUTTERCUP_RESET_AUTH);
export const setMyButtercupAuthenticated = createAction(MYBUTTERCUP_SET_AUTHENTICATED);
export const setMyButtercupAuthenticating = createAction(MYBUTTERCUP_SET_AUTHENTICATING);
export const setMyButtercupAccessToken = createAction(MYBUTTERCUP_SET_ACCESS_TOKEN);
export const setMyButtercupRefreshToken = createAction(MYBUTTERCUP_SET_REFRESH_TOKEN);
