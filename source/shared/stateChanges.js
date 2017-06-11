import { createNewArchiveFile } from "./explorerConnection.js";
import { cancelNewPrompt, setCreatingArchive } from "../actions/RemoteExplorerPage.js";
import { getCurrentPath, getNewFilename, getNewPassword } from "../selectors/RemoteExplorerPage.js";

export default function handleStateChange(store, dispatch) {
    const state = store.getState();
    const currentPath = getCurrentPath(state);
    const newPromptFilename = getNewFilename(state);
    const newPromptPassword = getNewPassword(state);
    if (newPromptFilename.length > 0 && newPromptPassword.length > 0) {
        // clear state for new item
        dispatch(cancelNewPrompt());
        dispatch(setCreatingArchive(true));
        createNewArchiveFile(currentPath, newPromptFilename, newPromptPassword)
            .then(function __handleCreated() {
                dispatch(setCreatingArchive(false));

            });
    }
}
