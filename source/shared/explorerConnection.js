import { createCredentials } from "buttercup-web";
import { getWebDAVConnection } from "../library/remote.js";
import { createEmptyArchive, getArchiveEncryptedContent } from "../library/buttercup.js";
import { addBCUPExtension, joinPathAndFilename } from "../library/format.js";
import { getCurrentPath, getNewFilename, getNewPassword } from "../selectors/RemoteExplorerPage.js";
import { /*cancelNewPrompt,*/ selectArchive, setCreatingArchive, showNewNamePrompt } from "../actions/RemoteExplorerPage.js";

const PATH_PARENT = /^\.\./;

let __remoteFSConnection = null;

export function createNewArchive(state, dispatch) {
    const currentPath = getCurrentPath(state);
    const newPromptFilename = getNewFilename(state);
    const newPromptPassword = getNewPassword(state);
    if (newPromptFilename.length > 0 && newPromptPassword.length > 0) {
        // clear state for new item
        // dispatch(cancelNewPrompt());
        dispatch(setCreatingArchive(true));
        createNewArchiveFile(currentPath, newPromptFilename, newPromptPassword)
            .then(function __handleCreated(filePath) {
                dispatch(setCreatingArchive(false));
                dispatch(selectArchive(filePath));
                dispatch(showNewNamePrompt());
            });
    }
}

export function createNewArchiveFile(currentDir, filename, password) {
    const archive = createEmptyArchive();
    const filePath = addBCUPExtension(joinPathAndFilename(currentDir, filename));
    return getArchiveEncryptedContent(archive, createCredentials.fromPassword(password))
        .then(function __handleEncryptedContents(encText) {
            return getSharedConnection()
                .writeFile(filePath, encText, "utf8")
                .then(() => filePath);
        });
}

export function createRemoteConnection(connectionInfo) {
    const {
        archiveType,
        remoteUsername,
        remotePassword,
        remoteURL
    } = connectionInfo;
    if (archiveType === "webdav") {
        return getWebDAVConnection(remoteURL, remoteUsername, remotePassword)
            .then(function __storeSharedInstance(afsInstance) {
                __remoteFSConnection = afsInstance;
            });
    }
    return Promise.reject(new Error(`Unknown archive type: ${archiveType}`));
}

export function getDirectoryContents(remoteDir) {
    return getSharedConnection()
        .readDirectory(remoteDir)
        .then(function __appendNavUp(items) {
            if (remoteDir !== "/") {
                items.unshift({
                    name: ".. (Up)",
                    path: "..",
                    isDirectory: () => true
                });
            }
            return items;
        })
        .then(items => items.map(item => ({
            name: item.name,
            path: item.path,
            isDir: item.isDirectory()
        })))
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
