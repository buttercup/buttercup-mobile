import {
    ARCHIVE_CONTENTS_MARK_READONLY,
    ARCHIVE_CONTENTS_SET_GROUPS,
    ARCHIVE_CONTENTS_SET_OTP_CODES,
    ARCHIVE_CONTENTS_SET_SOURCE,
    ARCHIVE_CONTENTS_TOGGLE_NEW_GROUP_PROMPT,
    ARCHIVE_CONTENTS_TOGGLE_REN_GROUP_PROMPT
} from "../actions/types.js";

const INITIAL = {
    groups: {},
    otpCodes: [],
    readOnly: false,
    selectedSourceID: null,
    showCreateGroupPrompt: false,
    showGroupRenamePrompt: false
};

export default function archiveContentsReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case ARCHIVE_CONTENTS_SET_GROUPS:
            return {
                ...state,
                groups: action.payload
            };
        case ARCHIVE_CONTENTS_SET_OTP_CODES:
            return {
                ...state,
                otpCodes: [...action.payload]
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
        case ARCHIVE_CONTENTS_TOGGLE_REN_GROUP_PROMPT:
            return {
                ...state,
                showGroupRenamePrompt: !!action.payload
            };
        case ARCHIVE_CONTENTS_MARK_READONLY:
            return {
                ...state,
                readOnly: !!action.payload
            };

        default:
            return state;
    }
}
