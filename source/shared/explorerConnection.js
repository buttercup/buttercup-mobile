import { Credentials } from "../library/buttercupCore.js";
import {
    getDropboxConnection,
    getGoogleDriveConnection,
    getNextcloudConnection,
    getOwnCloudConnection,
    getWebDAVConnection
} from "../library/remote.js";
import { createEmptyArchive, getArchiveEncryptedContent } from "../library/buttercup.js";
import { addBCUPExtension, joinPathAndFilename } from "../library/format.js";
import {
    getCurrentParent,
    getCurrentPath,
    getNewFilename,
    getNewPassword
} from "../selectors/RemoteExplorerPage.js";
import {
    selectArchive,
    setCreatingArchive,
    showNewNamePrompt
} from "../actions/RemoteExplorerPage.js";
import { doAsyncWork } from "../global/async.js";
import i18n from "../shared/i18n";

const PATH_PARENT = /^\.\./;

let __remoteFSConnection = null;

export function createNewArchive(state, dispatch) {
    const currentPath = getCurrentPath(state);
    const currentParentID = getCurrentParent(state);
    const newPromptFilename = getNewFilename(state);
    const newPromptPassword = getNewPassword(state);
    if (newPromptFilename.length > 0 && newPromptPassword.length > 0) {
        dispatch(setCreatingArchive(true));
        return doAsyncWork()
            .then(() =>
                createNewArchiveFile(
                    currentParentID,
                    currentPath,
                    newPromptFilename,
                    newPromptPassword
                )
            )
            .then(function __handleCreated(filePath) {
                dispatch(setCreatingArchive(false));
                dispatch(selectArchive(filePath));
                dispatch(showNewNamePrompt());
            });
    } else {
        throw new Error(i18n.t("vault.errors.failed-creating-new-vault"));
    }
}

function createNewArchiveFile(parentID, currentDir, filename, password) {
    const archive = createEmptyArchive();
    const fullFilename = addBCUPExtension(filename);
    const filePath = joinPathAndFilename(currentDir, fullFilename);
    return getArchiveEncryptedContent(archive, Credentials.fromPassword(password)).then(
        function __handleEncryptedContents(encText) {
            return getSharedConnection().writeFile({
                parentID,
                identifier: filePath,
                filename: fullFilename,
                data: encText,
                isNew: true
            }); // returns file identifier (or path)
        }
    );
}

export function createRemoteConnection(connectionInfo) {
    const __storeSharedInstance = fsInstance => {
        __remoteFSConnection = fsInstance;
    };
    const {
        archiveType,
        remoteUsername,
        remotePassword,
        remoteURL,
        dropboxToken,
        googleDriveToken
    } = connectionInfo;
    if (archiveType === "webdav") {
        return getWebDAVConnection(remoteURL, remoteUsername, remotePassword).then(
            __storeSharedInstance
        );
    } else if (archiveType === "owncloud") {
        return getOwnCloudConnection(remoteURL, remoteUsername, remotePassword).then(
            __storeSharedInstance
        );
    } else if (archiveType === "nextcloud") {
        return getNextcloudConnection(remoteURL, remoteUsername, remotePassword).then(
            __storeSharedInstance
        );
    } else if (archiveType === "dropbox") {
        return getDropboxConnection(dropboxToken).then(__storeSharedInstance);
    } else if (archiveType === "googledrive") {
        return getGoogleDriveConnection(googleDriveToken).then(__storeSharedInstance);
    }
    return Promise.reject(new Error(i18n.t("remote.errors.unknown-vault-type", { archiveType })));
}

export function getDirectoryContents(remoteDir) {
    return getSharedConnection()
        .getDirectoryContents(remoteDir)
        .then(items => {
            if (remoteDir !== "/") {
                items.unshift({
                    name: ".. (Up)",
                    path: "..",
                    isDirectory: () => true
                });
            }
            return items;
        })
        .then(items =>
            items.map(item => ({
                identifier: item.identifier,
                name: item.name,
                path: item.path,
                isDir: item.isDirectory()
            }))
        )
        .then(items => sortItems(items));
}

export function getSharedConnection() {
    return __remoteFSConnection;
}

export function sortItems(items) {
    return items.sort(function __sortItems(itemA, itemB) {
        const { isDir: aIsDir, name: aName, path: pathA } = itemA;
        const { isDir: bIsDir, name: bName, path: pathB } = itemB;
        if (PATH_PARENT.test(pathA)) {
            return -1;
        } else if (PATH_PARENT.test(pathB)) {
            return 1;
        }
        if (aIsDir && !bIsDir) {
            return -1;
        } else if (!aIsDir && bIsDir) {
            return 1;
        }
        if (aName > bName) {
            return 1;
        } else if (bName > aName) {
            return -1;
        }
        return 0;
    });
}
