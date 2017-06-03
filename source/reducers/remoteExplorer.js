import {
    ActionConst
} from "react-native-router-flux";
import {
    REMOTE_EXPLORER_CLEAR,
    REMOTE_EXPLORER_SET_CURRENT_DIR,
    REMOTE_EXPLORER_SET_ITEMS,
    REMOTE_EXPLORER_SET_LOADING
} from "../actions/types.js";

const INITIAL = {
    items: [],
    loading: false,
    remotePath: "/"
};

export default function remoteExplorerReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case REMOTE_EXPLORER_SET_ITEMS:
            return {
                ...state,
                items: action.payload
            };
        case REMOTE_EXPLORER_SET_CURRENT_DIR:
            return {
                ...state,
                remotePath: action.payload
            };
        case REMOTE_EXPLORER_SET_LOADING:
            return {
                ...state,
                loading: !!action.payload
            };
        case ActionConst.BACK_ACTION:
            /* falls-through */
        case REMOTE_EXPLORER_CLEAR:
            return INITIAL;

        default:
            return state;
    }
}
