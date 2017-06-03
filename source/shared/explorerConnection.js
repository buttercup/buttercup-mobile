import { getWebDAVConnection } from "../library/remote.js";

const PATH_PARENT = /^\.\./;

let __remoteFSConnection = null;

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
