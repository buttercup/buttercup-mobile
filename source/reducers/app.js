import {
    APP_PENDING_OTP_SET,
    APP_SET_BUSY_STATE,
    APP_SET_SEARCH_CONTEXT
} from "../actions/types.js";

const INITIAL = {
    busyState: null,
    pendingOTPURL: null,
    searchContext: "root"
};

export default function appReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case APP_SET_BUSY_STATE:
            return {
                ...state,
                busyState: action.payload
            };
        case APP_SET_SEARCH_CONTEXT:
            return {
                ...state,
                searchContext: action.payload
            };
        case APP_PENDING_OTP_SET:
            return {
                ...state,
                pendingOTPURL: action.payload
            };
        default:
            return state;
    }
}
