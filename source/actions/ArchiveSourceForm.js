import { createAction } from "redux-actions";
import {
    ADD_ARCHIVE_SET_CONNECTED,
    ADD_ARCHIVE_SET_CONNECTING,
    ADD_ARCHIVE_SET_PASSWORD,
    ADD_ARCHIVE_SET_URL,
    ADD_ARCHIVE_SET_USERNAME
} from "./types.js";

export const onChangePassword =                 createAction(ADD_ARCHIVE_SET_PASSWORD);
//export const onChangeURL =                      createAction(ADD_ARCHIVE_SET_URL);
export const onChangeURL = payload => ({
    type: ADD_ARCHIVE_SET_URL,
    payload
});
export const onChangeUsername =                 createAction(ADD_ARCHIVE_SET_USERNAME);
export const onConnected =                      createAction(ADD_ARCHIVE_SET_CONNECTED);
export const onConnectPressed =                 createAction(ADD_ARCHIVE_SET_CONNECTING);
