import { createClient as createDropboxClient } from "@buttercup/dropbox-client";
import { createClient as createWebDAVClient } from "webdav";
import joinURL from "url-join";

const NOOP = () => {};

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
    console.log("CREATE", remoteURL, username, password);
    const webdavClient = username
        ? createWebDAVClient(remoteURL, { username, password })
        : createWebDAVClient(remoteURL);
    return testRemoteFSConnection(webdavClient).then(() => wrapWebDAVClient(webdavClient));
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

function wrapWebDAVClient(client) {
    return {
        getDirectoryContents: dir =>
            client.getDirectoryContents(dir).then(items =>
                items.map(item => ({
                    name: item.basename,
                    path: item.filename,
                    isDirectory: () => item.type === "directory"
                }))
            ),
        getFileContents: remotePath => client.getFileContents(remotePath, { format: "text" })
    };
}
