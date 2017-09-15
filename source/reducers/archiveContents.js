import {
    ARCHIVE_CONTENTS_SET_GROUPS,
    ARCHIVE_CONTENTS_SET_SOURCE,
    ARCHIVE_CONTENTS_TOGGLE_NEW_GROUP_PROMPT
} from "../actions/types.js";

const INITIAL = {
    groups: {},
    selectedSourceID: null,
    showCreateGroupPrompt: false
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
        case ARCHIVE_CONTENTS_TOGGLE_NEW_GROUP_PROMPT:
            return {
                ...state,
                showCreateGroupPrompt: !!action.payload
            };

        default:
            return state;
    }
}
