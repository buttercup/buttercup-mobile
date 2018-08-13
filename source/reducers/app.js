import { APP_SET_BUSY_STATE } from "../actions/types.js";

const INITIAL = {
    busyState: null
};

export default function appReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case APP_SET_BUSY_STATE:
            return {
                ...state,
                busyState: action.payload
            };

        default:
            return state;
    }
}
