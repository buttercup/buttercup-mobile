import {
    BROWSER_RESET,
    BROWSER_SET_URL
} from "../actions/types.js";

const INITIAL = {
    url: "about:blank"
};

export default function browserReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case BROWSER_SET_URL:
            return {
                ...state,
                url: action.payload
            };
        case BROWSER_RESET:
            return {
                ...INITIAL
            };

        default:
            return state;
    }
}
