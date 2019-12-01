import { createAction } from "redux-actions";
import {
    ARCHIVES_SET,
    ARCHIVES_SET_OTP_CODES,
    ARCHIVES_SET_TOUCHID_ENABLED,
    ARCHIVES_TOGGLE_UNLOCK_PASS_PROMPT
} from "./types.js";

export const setArchives = createAction(ARCHIVES_SET);
export const setOTPCodes = createAction(ARCHIVES_SET_OTP_CODES);
export const setSourcesUsingTouchID = createAction(ARCHIVES_SET_TOUCHID_ENABLED);
export const showUnlockPasswordPrompt = createAction(ARCHIVES_TOGGLE_UNLOCK_PASS_PROMPT);
