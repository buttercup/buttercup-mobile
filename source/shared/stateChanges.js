import { createNewArchiveFile } from "./explorerConnection.js";
import { cancelNewPrompt, selectArchive, setCreatingArchive, showNewNamePrompt } from "../actions/RemoteExplorerPage.js";
import { getCurrentPath, getNewFilename, getNewPassword } from "../selectors/RemoteExplorerPage.js";

// function checkForNewFile(state, dispatch) {
//     const currentPath = getCurrentPath(state);
//     const newPromptFilename = getNewFilename(state);
//     const newPromptPassword = getNewPassword(state);
//     if (newPromptFilename.length > 0 && newPromptPassword.length > 0) {
//         // clear state for new item
//         // dispatch(cancelNewPrompt());
//         dispatch(setCreatingArchive(true));
//         createNewArchiveFile(currentPath, newPromptFilename, newPromptPassword)
//             .then(function __handleCreated(filePath) {
//                 dispatch(setCreatingArchive(false));
//                 dispatch(selectArchive(filePath));
//                 dispatch(showNewNamePrompt());
//             });
//     }
// }

export default function handleStateChange(store, dispatch) {
    const state = store.getState();
    // checkForNewFile(state, dispatch);
}
