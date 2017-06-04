import { createAction } from "redux-actions";
import {
    REMOTE_EXPLORER_CANCEL_NEW,
    REMOTE_EXPLORER_CLEAR,
    REMOTE_EXPLORER_CREATE_NEW,
    REMOTE_EXPLORER_CREATE_NEW_MASTERPASS,
    REMOTE_EXPLORER_SET_CREATING_ARCHIVE,
    REMOTE_EXPLORER_SET_CURRENT_DIR,
    REMOTE_EXPLORER_SET_ITEMS,
    REMOTE_EXPLORER_SET_LOADING,
    REMOTE_EXPLORER_SET_NEW_FILENAME,
    REMOTE_EXPLORER_SET_NEW_MASTERPASS
} from "./types.js";

export const cancelNewPrompt =                  createAction(REMOTE_EXPLORER_CANCEL_NEW);
export const onChangeDirectory =                createAction(REMOTE_EXPLORER_SET_CURRENT_DIR);
export const onReceiveItems =                   createAction(REMOTE_EXPLORER_SET_ITEMS);
export const setCreatingArchive =               createAction(REMOTE_EXPLORER_SET_CREATING_ARCHIVE);
export const setLoading =                       createAction(REMOTE_EXPLORER_SET_LOADING);
export const setNewFilename =                   createAction(REMOTE_EXPLORER_SET_NEW_FILENAME);
export const setNewMasterPassword =             createAction(REMOTE_EXPLORER_SET_NEW_MASTERPASS);
export const showNewMasterPasswordPrompt =      createAction(REMOTE_EXPLORER_CREATE_NEW_MASTERPASS);
export const showNewPrompt =                    createAction(REMOTE_EXPLORER_CREATE_NEW);
