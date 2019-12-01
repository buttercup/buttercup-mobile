import { createAction } from "redux-actions";
import {
    APP_MASTER_RESET,
    APP_PENDING_OTP_SET,
    APP_SET_BUSY_STATE,
    APP_SET_SEARCH_CONTEXT
} from "./types.js";

export const resetState = createAction(APP_MASTER_RESET);
export const setBusyState = createAction(APP_SET_BUSY_STATE);
export const setPendingOTPURL = createAction(APP_PENDING_OTP_SET);
export const setSearchContext = createAction(APP_SET_SEARCH_CONTEXT);
