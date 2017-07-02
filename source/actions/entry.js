import { createAction } from "redux-actions";
import {
    ENTRY_LOAD,
    ENTRY_UNLOAD
} from "./types.js";

export const loadEntry =                    createAction(ENTRY_LOAD);
export const unloadEntry =                  createAction(ENTRY_UNLOAD);
