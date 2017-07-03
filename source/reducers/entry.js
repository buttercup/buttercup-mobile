import {
    ENTRY_LOAD,
    ENTRY_NOTIFICATION_SET,
    ENTRY_UNLOAD
} from "../actions/types.js";

const INITIAL = {
    editing: false,
    id: null,
    properties: {},
    meta: {},
    sourceID: null,
    notification: ""
};

export default function entryReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case ENTRY_LOAD:
            const entry = action.payload;
            return {
                id: entry.id,
                properties: entry.properties,
                meta: entry.meta,
                sourceID: entry.sourceID
            };
        case ENTRY_UNLOAD:
            return {
                ...INITIAL
            };
        case ENTRY_NOTIFICATION_SET:
            return {
                ...state,
                notification: action.payload
            };

        default:
            return state;
    }
}
