import {
    ARCHIVES_ADD_LOCKED_SOURCE,
    ARCHIVES_ADD_UNLOCKED_SOURCE,
    ARCHIVES_LOCK_SOURCE,
    ARCHIVES_REMOVE_SOURCE,
    ARCHIVES_SET_TOUCHID_ENABLED,
    ARCHIVES_TOGGLE_IS_UNLOCKING,
    ARCHIVES_TOGGLE_UNLOCK_PASS_PROMPT,
    ARCHIVES_UNLOCK_SOURCE
} from "../actions/types.js";
import { ArchiveSourceStatus } from "../library/buttercup.js";

const { LOCKED, UNLOCKED } = ArchiveSourceStatus;

const INITIAL = {
    archives: [],
    archivesUsingTouchID: [],
    isUnlockingSelected: false,
    showUnlockPasswordPrompt: false
};

export default function archivesReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case ARCHIVES_TOGGLE_IS_UNLOCKING:
            return {
                ...state,
                isUnlockingSelected: !!action.payload
            };
        case ARCHIVES_ADD_UNLOCKED_SOURCE:
            return {
                ...state,
                archives: [
                    ...state.archives,
                    // ensure unlocked
                    { ...action.payload, status: UNLOCKED }
                ]
            };
        case ARCHIVES_ADD_LOCKED_SOURCE:
            return {
                ...state,
                archives: [
                    ...state.archives,
                    // ensure locked
                    { ...action.payload, status: LOCKED }
                ]
            };
        case ARCHIVES_TOGGLE_UNLOCK_PASS_PROMPT:
            return {
                ...state,
                showUnlockPasswordPrompt: !!action.payload
            };
        case ARCHIVES_UNLOCK_SOURCE: {
            const replacementSource = action.payload;
            const existingArchives = state.archives.filter(
                source => source.id !== replacementSource.id
            );
            return {
                ...state,
                archives: [...existingArchives, { ...replacementSource, status: UNLOCKED }]
            };
        }
        case ARCHIVES_LOCK_SOURCE: {
            const replacementSource = action.payload;
            const existingArchives = state.archives.filter(
                source => source.id !== replacementSource.id
            );
            return {
                ...state,
                archives: [...existingArchives, { ...replacementSource, status: LOCKED }]
            };
        }
        case ARCHIVES_REMOVE_SOURCE:
            return {
                ...state,
                archives: state.archives.filter(archive => archive.id !== action.payload)
            };
        case ARCHIVES_SET_TOUCHID_ENABLED:
            return {
                ...state,
                archivesUsingTouchID: [...action.payload]
            };

        default:
            return state;
    }
}
