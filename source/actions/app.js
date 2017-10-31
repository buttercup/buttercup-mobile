import { createAction } from "redux-actions";
import { APP_MASTER_RESET, APP_SET_SAVING } from "./types.js";

export const resetState = createAction(APP_MASTER_RESET);
export const setSaving = createAction(APP_SET_SAVING);
