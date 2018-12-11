import { createClient as createDropboxClient } from "@buttercup/dropbox-client";
import joinURL from "url-join";

const NOOP = () => {};
const PATH_ABS = /^\//;
const PATH_PARENT = /^\.\.$/;

export function getDropboxConnection(token) {
    const dropboxAdapter = createDropboxClient(token);
    return testRemoteFSConnection(dropboxAdapter).then(() => wrapDropboxClient(dropboxAdapter));
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
    const webdavFs = username
        ? createWebDAVAdapter(remoteURL, username, password)
        : createWebDAVAdapter(remoteURL);
    return testRemoteFSConnection(webdavFs).then(() => createAnyFSAdapter(webdavFs));
}

export function testRemoteFSConnection(client) {
    return client.getDirectoryContents("/").then(NOOP);
}

function wrapDropboxClient(client) {
    return {
        getDirectoryContents: remoteDir =>
            client.getDirectoryContents(remoteDir).then(items =>
                items.map(item => ({
                    name: item.name,
                    path: item.path,
                    isDirectory: () => item.type === "directory"
                }))
            ),
        getFileContents: remotePath => client.getFileContents(remotePath)
    };
}
