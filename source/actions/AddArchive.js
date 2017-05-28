import { createAction } from "redux-actions";
import {
    ADD_ARCHIVE_SET_ARCHIVE_TYPE,
    ADD_ARCHIVE_SET_PASSWORD,
    ADD_ARCHIVE_SET_URL,
    ADD_ARCHIVE_SET_USERNAME
} from "./types.js";

export const onArchiveTypeSelected =            createAction(ADD_ARCHIVE_SET_ARCHIVE_TYPE);
export const onChangePassword =                 createAction(ADD_ARCHIVE_SET_PASSWORD);
export const onChangeURL =                      createAction(ADD_ARCHIVE_SET_URL);
export const onChangeUsername =                 createAction(ADD_ARCHIVE_SET_USERNAME);
