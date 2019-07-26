import { createClient as createDropboxClient } from "@buttercup/dropbox-client";
import { createClient as createGoogleDriveClient } from "@buttercup/googledrive-client";
import { createClient as createWebDAVClient } from "webdav";
import joinURL from "url-join";

export function getDropboxConnection(token) {
    const dropboxAdapter = wrapDropboxClient(createDropboxClient(token));
    return testRemoteFSConnection(dropboxAdapter);
}

export function getGoogleDriveConnection(token) {
    const googleDriveAdapter = wrapGoogleDriveClient(createGoogleDriveClient(token));
    return testRemoteFSConnection(googleDriveAdapter);
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
    const webdavClient = username
        ? createWebDAVClient(remoteURL, { username, password })
        : createWebDAVClient(remoteURL);
    const webdavAdapter = wrapWebDAVClient(webdavClient);
    return testRemoteFSConnection(webdavAdapter);
}

export function testRemoteFSConnection(client) {
    return client.getDirectoryContents("/").then(() => client);
}

function wrapDropboxClient(client) {
    return {
        getDirectoryContents: remoteDir =>
            client.getDirectoryContents(remoteDir).then(items =>
                items.map(item => ({
                    identifier: item.path,
                    name: item.name,
                    path: item.path,
                    isDirectory: () => item.type === "directory"
                }))
            ),
        getFileContents: identifier => client.getFileContents(identifier),
        writeFile: (identifier, data /* , encoding */) => client.putFileContents(identifier, data)
    };
}

function wrapGoogleDriveClient(client) {
    return {
        getDirectoryContents: remoteDir =>
            client.mapDirectoryContents(remoteDir).then(items =>
                items.map(item => ({
                    identifier: item.id,
                    name: item.filename,
                    path: joinURL(item.dirPath, item.filename),
                    isDirectory: () => item.type === "directory"
                }))
            ),
        getFileContents: identifier => client.getFileContents(identifier),
        writeFile: (identifier, data /* , encoding */) => client.putFileContents(identifier, data)
    };
}

function wrapWebDAVClient(client) {
    return {
        getDirectoryContents: dir =>
            client.getDirectoryContents(dir).then(items =>
                items.map(item => ({
                    identifier: item.filename,
                    name: item.basename,
                    path: item.filename,
                    isDirectory: () => item.type === "directory"
                }))
            ),
        getFileContents: identifier => client.getFileContents(identifier, { format: "text" }),
        writeFile: (identifier, data /* , encoding */) => client.putFileContents(identifier, data)
    };
}
