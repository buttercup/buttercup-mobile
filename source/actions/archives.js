import { createAction } from "redux-actions";
import {
    ARCHIVES_ADD_LOCKED_SOURCE,
    ARCHIVES_ADD_UNLOCKED_SOURCE
} from "./types.js";

export const addLockedSource =                  createAction(ARCHIVES_ADD_LOCKED_SOURCE);
export const addUnlockedSource =                createAction(ARCHIVES_ADD_UNLOCKED_SOURCE);
