import {
    MYBUTTERCUP_RESET_AUTH,
    MYBUTTERCUP_SET_AUTHENTICATED,
    MYBUTTERCUP_SET_AUTHENTICATING,
    MYBUTTERCUP_SET_ACCESS_TOKEN,
    MYBUTTERCUP_SET_REFRESH_TOKEN
} from "../actions/types.js";

const INITIAL = {
    authenticated: false,
    authenticating: false,
    accessToken: null,
    refreshToken: null
};

export default function myButtercupReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case MYBUTTERCUP_SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: !!action.payload
            };
        case MYBUTTERCUP_SET_AUTHENTICATING:
            return {
                ...state,
                authenticating: !!action.payload
            };
        case MYBUTTERCUP_SET_ACCESS_TOKEN:
            return {
                ...state,
                accessToken: action.payload
            };
        case MYBUTTERCUP_SET_REFRESH_TOKEN:
            return {
                ...state,
                refreshToken: action.payload
            };
        case MYBUTTERCUP_RESET_AUTH:
            return {
                ...INITIAL
            };
        default:
            return state;
    }
}
