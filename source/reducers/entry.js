import {
    ENTRY_LOAD,
    ENTRY_NEW_CLEAR,
    ENTRY_NEW_META_CLEAR,
    ENTRY_NEW_META_SET,
    ENTRY_NOTIFICATION_SET,
    ENTRY_SET_EDITING,
    ENTRY_SET_FACADE_VALUE,
    ENTRY_SET_NEW_PARENT_GROUP,
    ENTRY_SET_NEW_PROPERTY_VALUE,
    ENTRY_UNLOAD
} from "../actions/types.js";

const INITIAL = {
    editing: false,
    id: null,
    newEntry: {
        title: "",
        username: "",
        parentID: "0",
        password: ""
    },
    newMeta: {
        key: "",
        value: ""
    },
    fields: [],
    sourceID: null,
    notification: ""
};

export default function entryReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case ENTRY_LOAD:
            const entryData = action.payload;
            return {
                ...state,
                id: entryData.id,
                fields: entryData.fields,
                sourceID: entryData.sourceID
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
        case ENTRY_NEW_CLEAR:
            return {
                ...state,
                newEntry: INITIAL.newEntry
            };
        case ENTRY_NEW_META_CLEAR:
            return {
                ...state,
                newMeta: INITIAL.newMeta
            };
        case ENTRY_NEW_META_SET:
            return {
                ...state,
                newMeta: {
                    key: action.payload.key,
                    value: action.payload.value
                }
            };
        case ENTRY_SET_NEW_PROPERTY_VALUE:
            return {
                ...state,
                newEntry: {
                    ...state.newEntry,
                    [action.payload.key]: action.payload.value
                }
            };
        case ENTRY_SET_NEW_PARENT_GROUP:
            return {
                ...state,
                newEntry: {
                    ...state.newEntry,
                    parentID: action.payload
                }
            };
        case ENTRY_SET_EDITING:
            return {
                ...state,
                editing: !!action.payload
            };
        case ENTRY_SET_FACADE_VALUE:
            const {
                field,
                property,
                value
            } = action.payload;
            const targetIndex = state.fields.findIndex(item => item.field === field && item.property === property);
            const newFields = [ ...state.fields ];
            newFields[targetIndex] = {
                ...newFields[targetIndex],
                value
            };
            return {
                ...state,
                fields: newFields
            };

        default:
            return state;
    }
}
