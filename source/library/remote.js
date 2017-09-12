import {
    createAnyFSAdapter,
    createDropboxAdapter,
    createWebDAVAdapter
} from "@buttercup/mobile-compat";
import joinURL from "url-join";

const PATH_ABS = /^\//;
const PATH_PARENT = /^\.\.$/;

export function getDropboxConnection(token) {
    const dropboxAdapter = createDropboxAdapter({
        apiKey: token
    });
    return testRemoteFSConnection(dropboxAdapter)
        .then(() => createAnyFSAdapter(dropboxAdapter));
}

export function getNextcloudConnection(remoteURL, username, password) {
    const nextcloudUrl = joinURL(remoteURL, "/remote.php/webdav");
    return getWebDAVConnection(nextcloudUrl, username, password);
}

export function getOwnCloudConnection(remoteURL, username, password) {
    const owncloudUrl = joinURL(remoteURL, "/remote.php/webdav");
    return getWebDAVConnection(owncloudUrl, username, password);
}

export function getWebDAVConnection(remoteURL, username, password) {
    const webdavFs = username ?
        createWebDAVAdapter(remoteURL, username, password) :
        createWebDAVAdapter(remoteURL);
    return testRemoteFSConnection(webdavFs)
        .then(() => createAnyFSAdapter(webdavFs));
}

export function testRemoteFSConnection(fsInstance) {
    return new Promise(function __testFSWithStat(resolve, reject) {
        fsInstance.readdir("/", function __handleStatResponse(err, stat) {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
}
