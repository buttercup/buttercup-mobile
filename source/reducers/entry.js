import {
    ENTRY_LOAD,
    ENTRY_NEW_CLEAR,
    ENTRY_NEW_META_CLEAR,
    ENTRY_NEW_META_SET,
    ENTRY_NEW_META_VALUETYPE_SET,
    ENTRY_PROP_EDIT_MERGE,
    ENTRY_PROP_EDIT_SET,
    ENTRY_SET_EDITING,
    ENTRY_SET_FACADE_VALUE,
    ENTRY_SET_NEW_PARENT_GROUP,
    ENTRY_SET_NEW_PROPERTY_VALUE,
    ENTRY_SET_VIEWING_HIDDEN,
    ENTRY_UNLOAD
} from "../actions/types.js";

const INITIAL = {
    editing: false,
    editProperty: null,
    id: null,
    newEntry: {
        title: "",
        username: "",
        parentID: "0",
        password: ""
    },
    newMeta: {
        key: "",
        value: "",
        valueType: null
    },
    facade: null,
    sourceID: null,
    viewingHidden: false
};

export default function entryReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case ENTRY_LOAD:
            const entryData = action.payload;
            return {
                ...state,
                id: entryData.id,
                facade: entryData.facade,
                sourceID: entryData.sourceID
            };
        case ENTRY_UNLOAD:
            return {
                ...INITIAL
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
                    ...state.newMeta,
                    key: action.payload.key,
                    value: action.payload.value
                }
            };
        case ENTRY_NEW_META_VALUETYPE_SET:
            return {
                ...state,
                newMeta: {
                    ...state.newMeta,
                    valueType: action.payload
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
                editing: !!action.payload,
                viewingHidden: false
            };
        case ENTRY_SET_VIEWING_HIDDEN:
            return {
                ...state,
                viewingHidden: !!action.payload,
                editing: false
            };
        case ENTRY_SET_FACADE_VALUE:
            const { field, property, value } = action.payload;
            const targetIndex = state.facade.fields.findIndex(
                item => item.propertyType === field && item.property === property
            );
            const newFields = [...state.facade.fields];
            newFields[targetIndex] = {
                ...newFields[targetIndex],
                value
            };
            return {
                ...state,
                facade: {
                    ...state.facade,
                    fields: newFields
                }
            };
        case ENTRY_PROP_EDIT_SET:
            return {
                ...state,
                editProperty: { ...action.payload }
            };
        case ENTRY_PROP_EDIT_MERGE:
            return {
                ...state,
                editProperty: {
                    ...state.editProperty,
                    ...action.payload
                }
            };

        default:
            return state;
    }
}
