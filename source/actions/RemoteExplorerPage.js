import { createAction } from "redux-actions";
import {
    REMOTE_EXPLORER_CLEAR,
    REMOTE_EXPLORER_SET_CURRENT_DIR,
    REMOTE_EXPLORER_SET_ITEMS,
    REMOTE_EXPLORER_SET_LOADING
} from "./types.js";

export const onChangeDirectory =                createAction(REMOTE_EXPLORER_SET_CURRENT_DIR);
export const onReceiveItems =                   createAction(REMOTE_EXPLORER_SET_ITEMS);
export const setLoading =                       createAction(REMOTE_EXPLORER_SET_LOADING);
