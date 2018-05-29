import { createAction } from "redux-actions";
import { ADD_ARCHIVE_SET_ARCHIVE_TYPE } from "./types.js";

export const onArchiveTypeSelected = createAction(ADD_ARCHIVE_SET_ARCHIVE_TYPE);
