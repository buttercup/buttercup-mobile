import {
    GOOGLE_DRIVE_RESET_AUTH,
    GOOGLE_DRIVE_SET_AUTHENTICATED,
    GOOGLE_DRIVE_SET_AUTHENTICATING,
    GOOGLE_DRIVE_SET_AUTH_TOKEN
} from "../actions/types.js";

const INITIAL = {
    authenticated: false,
    authenticating: false,
    authToken: null
};

export default function googleDriveReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case GOOGLE_DRIVE_SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: !!action.payload
            };
        case GOOGLE_DRIVE_SET_AUTHENTICATING:
            return {
                ...state,
                authenticating: !!action.payload
            };
        case GOOGLE_DRIVE_SET_AUTH_TOKEN:
            return {
                ...state,
                authToken: action.payload
            };
        case GOOGLE_DRIVE_RESET_AUTH:
            return {
                ...INITIAL
            };

        default:
            return state;
    }
}
