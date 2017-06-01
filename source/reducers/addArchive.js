import {
    ActionConst
} from "react-native-router-flux";
import {
    ADD_ARCHIVE_CLEAR_PROGRESS,
    ADD_ARCHIVE_SET_ARCHIVE_TYPE,
    ADD_ARCHIVE_SET_CONNECTING,
    ADD_ARCHIVE_SET_PASSWORD,
    ADD_ARCHIVE_SET_URL,
    ADD_ARCHIVE_SET_USERNAME
} from "../actions/types.js";

const INITIAL = {
    archiveType: null,
    connection: "none",
    remoteURL: "",
    remoteUsername: "",
    remotePassword: ""
};

export default function addArchiveReducer(state = INITIAL, action = {}) {
    console.log("ACTION", action.type, action.payload);
    switch (action.type) {
        case ADD_ARCHIVE_SET_ARCHIVE_TYPE:
            return {
                ...state,
                archiveType: action.payload
            };
        case ADD_ARCHIVE_SET_CONNECTING:
            return {
                ...state,
                connection: "connecting"
            };
        case ADD_ARCHIVE_SET_PASSWORD:
            return {
                ...state,
                remotePassword: action.payload
            };
        case ADD_ARCHIVE_SET_URL:
            return {
                ...state,
                remoteURL: action.payload
            };
        case ADD_ARCHIVE_SET_USERNAME:
            return {
                ...state,
                remoteUsername: action.payload
            };
        case ActionConst.BACK_ACTION:
            /* falls-through */
        case ADD_ARCHIVE_CLEAR_PROGRESS:
            return INITIAL;

        default:
            return state;
    }
}
