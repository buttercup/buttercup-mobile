import {
    createWebDAVFSAdapter,
    createAnyFSAdapter
} from "@buttercup/mobile-compat";

let __remoteFSConnection = null;

export function createRemoteConnection(connectionInfo) {
    console.log("Connected", connectionInfo);
    const {
        archiveType,
        remoteUsername,
        remotePassword,
        remoteURL
    } = connectionInfo;
    if (archiveType === "webdav") {
        return createSharedWebDAVConnection(remoteURL, remoteUsername, remotePassword);
    }
    return Promise.reject(new Error(`Unknown archive type: ${archiveType}`));
}

export function createSharedWebDAVConnection(remoteURL, username, password) {
    return getWebDAVConnection(remoteURL, username, password)
        .then(function __storeSharedInstance(afsInstance) {
            __remoteFSConnection = afsInstance;
        });
}

export function getWebDAVConnection(remoteURL, username, password) {
    const webdavFs = username ?
        createWebDAVFSAdapter(remoteURL, username, password) :
        createWebDAVFSAdapter(remoteURL);
    return testRemoteFSConnection(fsInstance)
        .then(() => createAnyFSAdapter(webdavFs));
}

export function testRemoteFSConnection(fsInstance) {
    return new Promise(function __testFSWithStat(resolve, reject) {
        fsInstance.stat("/", function __handleStatResponse(err, stat) {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
}
