import {
    ARCHIVES_ADD_UNLOCKED_SOURCE
} from "../actions/types.js";
import { ArchiveSourceStatus } from "../library/buttercup.js";

const { LOCKED, UNLOCKED } = ArchiveSourceStatus;

const INITIAL = {
    archives: []
};

export default function archivesReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case ARCHIVES_ADD_UNLOCKED_SOURCE:
            return {
                ...state,
                archives: [...state.archives,
                    // ensure unlocked
                    { ...action.payload, status: UNLOCKED }
                ]
            };

        default:
            return state;
    }
}
