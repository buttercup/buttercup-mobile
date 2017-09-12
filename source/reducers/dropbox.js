import {
    DROPBOX_RESET_AUTH,
    DROPBOX_SET_AUTHENTICATED,
    DROPBOX_SET_AUTHENTICATING,
    DROPBOX_SET_AUTH_TOKEN,
    DROPBOX_SET_NOTIFICATION
} from "../actions/types.js";

const INITIAL = {
    authenticated: false,
    authenticating: false,
    authToken: null,
    notification: ""
};

export default function dropboxReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case DROPBOX_SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: !!action.payload
            };
        case DROPBOX_SET_AUTHENTICATING:
            return {
                ...state,
                authenticating: !!action.payload
            };
        case DROPBOX_SET_AUTH_TOKEN:
            return {
                ...state,
                authToken: action.payload
            };
        case DROPBOX_RESET_AUTH:
            return {
                ...INITIAL
            };
        case DROPBOX_SET_NOTIFICATION:
            return {
                ...state,
                notification: action.payload
            };

        default:
            return state;
    }
}
