import { getWebDAVConnection } from "../library/remote.js";

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
        })));
}

export function getSharedConnection() {
    return __remoteFSConnection;
}
