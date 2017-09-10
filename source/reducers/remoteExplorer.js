import {
    REMOTE_EXPLORER_CANCEL_NEW,
    REMOTE_EXPLORER_CLEAR,
    REMOTE_EXPLORER_CREATE_NEW_FILENAME,
    REMOTE_EXPLORER_CREATE_NEW_MASTERPASS,
    REMOTE_EXPLORER_CREATE_NEW_NAME,
    REMOTE_EXPLORER_SELECT_ARCHIVE,
    REMOTE_EXPLORER_SET_ADDING_ARCHIVE,
    REMOTE_EXPLORER_SET_CREATE_NEW,
    REMOTE_EXPLORER_SET_CREATING_ARCHIVE,
    REMOTE_EXPLORER_SET_CURRENT_DIR,
    REMOTE_EXPLORER_SET_ITEMS,
    REMOTE_EXPLORER_SET_LOADING,
    REMOTE_EXPLORER_SET_NEW_FILENAME,
    REMOTE_EXPLORER_SET_NEW_MASTERPASS,
    REMOTE_EXPLORER_SET_NEW_NAME
} from "../actions/types.js";

const INITIAL = {
    adding: false,
    createNew: true,
    creatingFile: false,
    items: [],
    loading: false,
    newPromptArchiveName: "",
    newPromptFilename: "",
    newPromptPassword: "",
    remotePath: "/",
    selectedArchivePath: null,
    showNewNamePrompt: false,
    showNewPasswordPrompt: false,
    showNewPrompt: false
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
        case REMOTE_EXPLORER_SET_CREATING_ARCHIVE:
            return {
                ...state,
                creatingFile: !!action.payload
            };
        case REMOTE_EXPLORER_CREATE_NEW_FILENAME:
            return {
                ...state,
                showNewPrompt: true
            };
        case REMOTE_EXPLORER_CANCEL_NEW:
            return {
                ...state,
                newPromptFilename: "",
                showNewPrompt: false,
                newPromptPassword: "",
                showNewPasswordPrompt: false,
                newPromptArchiveName: "",
                showNewNamePrompt: false
            };
        case REMOTE_EXPLORER_SET_NEW_FILENAME:
            return {
                ...state,
                showNewPrompt: false,
                newPromptFilename: action.payload
            };
        case REMOTE_EXPLORER_CREATE_NEW_MASTERPASS:
            return {
                ...state,
                showNewPasswordPrompt: true
            };
        case REMOTE_EXPLORER_CREATE_NEW_NAME:
            return {
                ...state,
                showNewNamePrompt: true
            };
        case REMOTE_EXPLORER_SET_NEW_MASTERPASS:
            return {
                ...state,
                newPromptPassword: action.payload,
                showNewPasswordPrompt: false
            };
        case REMOTE_EXPLORER_SET_NEW_NAME:
            return {
                ...state,
                newPromptArchiveName: action.payload,
                showNewNamePrompt: false
            };
        case REMOTE_EXPLORER_SELECT_ARCHIVE:
            return {
                ...state,
                selectedArchivePath: action.payload
            };
        case REMOTE_EXPLORER_SET_CREATE_NEW:
            return {
                ...state,
                createNew: !!action.payload
            };
        case REMOTE_EXPLORER_SET_ADDING_ARCHIVE:
            return {
                ...state,
                adding: !!action.payload
            };
        case REMOTE_EXPLORER_CLEAR:
            return INITIAL;

        default:
            return state;
    }
}
