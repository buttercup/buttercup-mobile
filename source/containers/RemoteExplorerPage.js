import { connect } from "react-redux";
import RemoteExplorer from "../components/RemoteExplorerPage.js";
import { navigateToRoot } from "../actions/navigation.js";
import {
    getCurrentItems,
    getCurrentPath,
    getNewArchiveDetails,
    isAddingArchive,
    isCreatingFile,
    isLoading,
    shouldShowNewFilePrompt,
    shouldShowNewNamePrompt,
    shouldShowPasswordPrompt,
    willCreateNewArchive
} from "../selectors/RemoteExplorerPage.js";
import { getRemoteConnectionInfo } from "../selectors/RemoteConnectPage.js";
import { getToken as getDropboxToken } from "../selectors/dropbox.js";
import {
    getAuthToken as getGoogleDriveToken,
    getRefreshToken as getGoogleDriveRefreshToken
} from "../selectors/googleDrive";
import {
    cancelNewPrompt,
    onChangeDirectory,
    onChangeParentID,
    onReceiveItems,
    selectArchive,
    setAddingArchive,
    setCreateNew,
    setLoading,
    setNewArchiveName,
    setNewFilename,
    setNewMasterPassword,
    showNewNamePrompt,
    showNewMasterPasswordPrompt,
    showNewPrompt
} from "../actions/RemoteExplorerPage.js";
import { createNewArchive, getDirectoryContents } from "../shared/explorerConnection.js";
import {
    addArchiveToArchiveManager,
    createArchiveCredentials,
    createRemoteCredentials
} from "../library/buttercup.js";
import { handleError } from "../global/exceptions.js";

function addToArchiveManager(state) {
    const {
        archiveName,
        archivePath,
        archivePassword,
        archiveType,
        remoteUsername,
        remotePassword,
        remoteURL
    } = { ...getNewArchiveDetails(state), ...getRemoteConnectionInfo(state) };
    const dropboxToken = getDropboxToken(state);
    const googleDriveToken = getGoogleDriveToken(state);
    const googleDriveRefreshToken = getGoogleDriveRefreshToken(state);
    const sourceCredentials = createRemoteCredentials(archiveType, {
        username: remoteUsername,
        password: remotePassword,
        url: remoteURL,
        path: archivePath,
        dropboxToken,
        googleDriveToken,
        googleDriveRefreshToken
    });
    const archiveCredentials = createArchiveCredentials(archivePassword);
    return addArchiveToArchiveManager(
        archiveName,
        sourceCredentials,
        archiveCredentials,
        archiveType
    );
}

function handleNewArchiveName(name, dispatch, getState) {
    dispatch(setNewArchiveName(name));
    dispatch(setAddingArchive(true));
    // call to add with new state
    addToArchiveManager({ ...getState(), archiveName: name })
        .then(function __getOuttaHere() {
            dispatch(setAddingArchive(false));
            dispatch(navigateToRoot());
        })
        .catch(function __handleAddError(err) {
            dispatch(setAddingArchive(false));
            handleError("Failed adding vault", err);
        });
}

function handleNewFile(filename, dispatch, getState) {
    dispatch(setNewFilename(filename));
    dispatch(setCreateNew(true));
    dispatch(showNewMasterPasswordPrompt());
}

function handleNewMasterPassword(password, dispatch, getState) {
    dispatch(setNewMasterPassword(password));
    const state = getState();
    if (willCreateNewArchive(state)) {
        createNewArchive(state, dispatch);
    } else {
        dispatch(showNewNamePrompt());
    }
}

function handlePathSelection(nextIdentifier, nextItem, isDir, resetScroll, dispatch, getState) {
    const currentPath = getCurrentPath(getState());
    const nextPath = nextItem === ".." ? removeLastPathItem(currentPath) : nextItem;
    if (isDir) {
        // directory
        dispatch(setLoading(true));
        return getDirectoryContents(nextPath)
            .then(contents => dispatch(onReceiveItems(contents)))
            .then(function __afterContentsLoaded() {
                resetScroll();
                dispatch(onChangeDirectory(nextPath));
                dispatch(onChangeParentID(nextIdentifier));
                dispatch(setLoading(false));
            })
            .catch(err => {
                dispatch(setLoading(false));
                handleError("Failed fetching remote contents", err);
            });
    }
    // file
    dispatch(setCreateNew(false));
    dispatch(selectArchive(nextIdentifier));
    dispatch(showNewMasterPasswordPrompt());
}

function removeLastPathItem(pathStr) {
    const parts = pathStr.split("/");
    const newPath = parts
        .slice(0, parts.length - 1)
        .join("/")
        .trim();
    return newPath.length > 0 ? newPath : "/";
}

export default connect(
    (state, ownProps) => ({
        addingArchive: isAddingArchive(state),
        creatingFile: isCreatingFile(state),
        items: getCurrentItems(state),
        loading: isLoading(state),
        remoteDirectory: getCurrentPath(state),
        showNewName: shouldShowNewNamePrompt(state),
        showNewPassword: shouldShowPasswordPrompt(state),
        showNewPrompt: shouldShowNewFilePrompt(state)
    }),
    {
        cancelNewPrompt,
        onNewArchiveName: name => (dispatch, getState) =>
            handleNewArchiveName(name, dispatch, getState),
        onNewFilename: filename => (dispatch, getState) =>
            handleNewFile(filename, dispatch, getState),
        onNewMasterPassword: password => (dispatch, getState) =>
            handleNewMasterPassword(password, dispatch, getState),
        onPathSelected: (remoteIdentifier, remoteItem, isDir, scrollResetCB) => (
            dispatch,
            getState
        ) =>
            handlePathSelection(
                remoteIdentifier,
                remoteItem,
                isDir,
                scrollResetCB,
                dispatch,
                getState
            )
    }
)(RemoteExplorer);
