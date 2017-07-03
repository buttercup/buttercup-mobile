import { createAction } from "redux-actions";
import {
    ENTRY_LOAD,
    ENTRY_NOTIFICATION_SET,
    ENTRY_UNLOAD
} from "./types.js";

export const loadEntry =                    createAction(ENTRY_LOAD);
export const setNotification =              createAction(ENTRY_NOTIFICATION_SET);
export const unloadEntry =                  createAction(ENTRY_UNLOAD);
