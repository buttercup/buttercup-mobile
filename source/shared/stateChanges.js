import { createNewArchiveFile } from "./explorerConnection.js";
import { cancelNewPrompt, setCreatingArchive } from "../actions/RemoteExplorerPage.js";

const REMOTE_EXPLORER_STATE_KEY = "remoteExplorer";

export default function handleStateChange(store, dispatch) {
    const state = store.getState();
    const {
        newPromptFilename,
        newPromptPassword
    } = state[REMOTE_EXPLORER_STATE_KEY];
    if (newPromptFilename.length > 0 && newPromptPassword.length > 0) {
        // clear state for new item
        dispatch(cancelNewPrompt());
        dispatch(setCreatingArchive(true));
        createNewArchiveFile(newPromptFilename, newPromptPassword)
            .then(function __handleCreated() {
                dispatch(setCreatingArchive(false));
                alert("Created!");
            });
    }
}
