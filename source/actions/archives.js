import { createAction } from "redux-actions";
import {
    ARCHIVES_SET,
    ARCHIVES_SET_TOUCHID_ENABLED,
    ARCHIVES_TOGGLE_IS_UNLOCKING,
    ARCHIVES_TOGGLE_UNLOCK_PASS_PROMPT
} from "./types.js";

export const setArchives = createAction(ARCHIVES_SET);
export const setIsUnlocking = createAction(ARCHIVES_TOGGLE_IS_UNLOCKING);
export const setSourcesUsingTouchID = createAction(ARCHIVES_SET_TOUCHID_ENABLED);
export const showUnlockPasswordPrompt = createAction(ARCHIVES_TOGGLE_UNLOCK_PASS_PROMPT);
