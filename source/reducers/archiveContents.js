import {
    ARCHIVE_CONTENTS_SET_GROUPS,
    ARCHIVE_CONTENTS_SET_SOURCE
} from "../actions/types.js";

const INITIAL = {
    groups: {},
    selectedSourceID: null
};

export default function archiveContentsReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case ARCHIVE_CONTENTS_SET_GROUPS:
            return {
                ...state,
                groups: action.payload
            };
        case ARCHIVE_CONTENTS_SET_SOURCE:
            return {
                ...state,
                selectedSourceID: action.payload
            };

        default:
            return state;
    }
}
