import { createAction } from "redux-actions";
import { APP_MASTER_RESET, APP_SET_BUSY_STATE } from "./types.js";

export const resetState = createAction(APP_MASTER_RESET);
export const setBusyState = createAction(APP_SET_BUSY_STATE);
