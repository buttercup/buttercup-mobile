import {
    AUTOFILL_SET_CONTEXT,
    AUTOFILL_SET_URLS,
    AUTOFILL_SET_IDENTITY
} from "../actions/types.js";

const INITIAL = {
    isContextAutoFill: false,
    urls: [],
    identity: null
};

export default function appReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case AUTOFILL_SET_CONTEXT:
            return {
                ...state,
                isContextAutoFill: action.payload
            };
        case AUTOFILL_SET_URLS:
            return {
                ...state,
                urls: action.payload
            };
        case AUTOFILL_SET_IDENTITY:
            return {
                ...state,
                identity: action.payload
            };
        default:
            return state;
    }
}
