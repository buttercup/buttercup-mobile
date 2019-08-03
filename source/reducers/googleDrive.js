import {
    GOOGLEDRIVE_RESET_AUTH,
    GOOGLEDRIVE_SET_AUTHENTICATED,
    GOOGLEDRIVE_SET_AUTHENTICATING,
    GOOGLEDRIVE_SET_AUTH_CODE,
    GOOGLEDRIVE_SET_AUTH_TOKEN,
    GOOGLEDRIVE_SET_REFRESH_TOKEN
} from "../actions/types.js";

const INITIAL = {
    authenticated: false,
    authenticating: false,
    authCode: null,
    authToken: null,
    refreshToken: null
};

export default function googleDriveReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case GOOGLEDRIVE_SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: !!action.payload
            };
        case GOOGLEDRIVE_SET_AUTHENTICATING:
            return {
                ...state,
                authenticating: !!action.payload
            };
        case GOOGLEDRIVE_SET_AUTH_CODE:
            return {
                ...state,
                authCode: action.payload
            };
        case GOOGLEDRIVE_SET_AUTH_TOKEN:
            return {
                ...state,
                authToken: action.payload
            };
        case GOOGLEDRIVE_SET_REFRESH_TOKEN:
            return {
                ...state,
                refreshToken: action.payload
            };
        case GOOGLEDRIVE_RESET_AUTH:
            return {
                ...INITIAL
            };
        default:
            return state;
    }
}
