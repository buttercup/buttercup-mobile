import {
    ActionConst
} from "react-native-router-flux";
import {
    ADD_ARCHIVE_CLEAR_PROGRESS,
    ADD_ARCHIVE_SET_ARCHIVE_TYPE
} from "../actions/types.js";

const INITIAL = {
    archiveType: null
};

export default function addArchiveReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case ADD_ARCHIVE_SET_ARCHIVE_TYPE:
            return {
                ...state,
                archiveType: action.payload
            };
        case ActionConst.BACK_ACTION:
            /* falls-through */
        case ADD_ARCHIVE_CLEAR_PROGRESS:
            return INITIAL;

        default:
            return state;
    }
}
