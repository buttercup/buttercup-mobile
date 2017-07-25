import { createAction } from "redux-actions";
import {
    ENTRY_LOAD,
    ENTRY_NEW_META_CLEAR,
    ENTRY_NEW_META_SET,
    ENTRY_NOTIFICATION_SET,
    ENTRY_UNLOAD
} from "./types.js";

export const clearNewMeta =                 createAction(ENTRY_NEW_META_CLEAR);
export const loadEntry =                    createAction(ENTRY_LOAD);
export const setNewMeta =                   createAction(ENTRY_NEW_META_SET);
export const setNotification =              createAction(ENTRY_NOTIFICATION_SET);
export const unloadEntry =                  createAction(ENTRY_UNLOAD);
