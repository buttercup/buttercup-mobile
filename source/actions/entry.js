import { createAction } from "redux-actions";
import {
    ENTRY_LOAD,
    ENTRY_NEW_CLEAR,
    ENTRY_PROP_EDIT_MERGE,
    ENTRY_PROP_EDIT_SET,
    ENTRY_SET_EDITING,
    ENTRY_SET_FACADE_VALUE,
    ENTRY_SET_NEW_PARENT_GROUP,
    ENTRY_SET_NEW_PROPERTY_VALUE,
    ENTRY_SET_VIEWING_HIDDEN,
    ENTRY_UNLOAD
} from "./types.js";

export const clearNewEntry = createAction(ENTRY_NEW_CLEAR);
export const loadEntry = createAction(ENTRY_LOAD);
export const mergeEntryPropertyEdit = createAction(ENTRY_PROP_EDIT_MERGE);
export const setEntryEditing = createAction(ENTRY_SET_EDITING);
export const setEntryPropertyEdit = createAction(ENTRY_PROP_EDIT_SET);
export const setFacadeValue = createAction(ENTRY_SET_FACADE_VALUE);
export const setNewEntryParentGroup = createAction(ENTRY_SET_NEW_PARENT_GROUP);
export const setNewEntryProperty = createAction(ENTRY_SET_NEW_PROPERTY_VALUE);
export const setViewingHidden = createAction(ENTRY_SET_VIEWING_HIDDEN);
export const unloadEntry = createAction(ENTRY_UNLOAD);
