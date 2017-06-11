import { connect } from "react-redux";
import RemoteExplorer from "../components/RemoteExplorerPage.js";
import {
    getCurrentItems,
    getCurrentPath,
    isCreatingFile,
    isLoading,
    shouldShowNewFilePrompt,
    shouldShowPasswordPrompt
} from "../selectors/RemoteExplorerPage.js";
import {
    cancelNewPrompt,
    onChangeDirectory,
    onReceiveItems,
    setLoading,
    setNewFilename,
    setNewMasterPassword,
    showNewMasterPasswordPrompt
} from "../actions/RemoteExplorerPage.js";
import { getDirectoryContents } from "../shared/explorerConnection.js";

function handleNewFile(filename, dispatch, getState) {
    dispatch(setNewFilename(filename));
    dispatch(showNewMasterPasswordPrompt());
}

function handleNewMasterPassword(password, dispatch, getState) {
    dispatch(setNewMasterPassword(password));
}

function handlePathSelection(nextItem, resetScroll, dispatch, getState) {
    const currentPath = getCurrentPath(getState());
    const nextPath = nextItem === ".." ?
        removeLastPathItem(currentPath) :
        nextItem;
    dispatch(setLoading(true));
    getDirectoryContents(nextPath)
        .then(contents => dispatch(onReceiveItems(contents)))
        .then(function __afterContentsLoaded() {
            resetScroll();
            dispatch(onChangeDirectory(nextPath));
            dispatch(setLoading(false));
        });
}

function removeLastPathItem(pathStr) {
    const parts = pathStr.split("/");
    const newPath = parts.slice(0, parts.length - 1).join("/").trim();
    return newPath.length > 0 ?
        newPath :
        "/";
}

export default connect(
    (state, ownProps) => ({
        creatingFile:                   isCreatingFile(state),
        items:                          getCurrentItems(state),
        loading:                        isLoading(state),
        remoteDirectory:                getCurrentPath(state),
        showNewPassword:                shouldShowPasswordPrompt(state),
        showNewPrompt:                  shouldShowNewFilePrompt(state)
    }),
    {
        cancelNewPrompt,
        // onNewFilename:                  (...args) => { console.log("onNewFilename", ...args); },
        onNewFilename:                  (filename) => (dispatch, getState) =>
                                            handleNewFile(filename, dispatch, getState),
        onNewMasterPassword:            (password) => (dispatch, getState) =>
                                            handleNewMasterPassword(password, dispatch, getState),
        onPathSelected:                 (remoteItem, scrollResetCB) => (dispatch, getState) =>
                                            handlePathSelection(remoteItem, scrollResetCB, dispatch, getState)
    }
)(RemoteExplorer);
