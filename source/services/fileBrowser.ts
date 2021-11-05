import { AuthType, createClient as createWebDAVClient } from "webdav";
import { createClient as createDropboxClient } from "@buttercup/dropbox-client";
import { createClient as createGoogleDriveClient } from "@buttercup/googledrive-client";
import { FileSystemInterface, instantiateInterface } from "@buttercup/file-interface";

let __interface: FileSystemInterface = null;

export function disableCurrentInterface() {
    __interface = null;
}

export function getCurrentInterface(): FileSystemInterface {
    return __interface;
}

export async function prepareDropboxInterface(token: string): Promise<void> {
    const dropboxClient = createDropboxClient(token);
    __interface = instantiateInterface("dropbox", { dropboxClient });
}

export async function prepareGoogleDriveInterface(token: string): Promise<void> {
    const googleDriveClient = createGoogleDriveClient(token);
    __interface = instantiateInterface("googledrive", { googleDriveClient });
}

export async function prepareWebDAVInterface(
    url: string,
    username: string,
    password: string
): Promise<void> {
    const webdavClient = createWebDAVClient(url, {
        authType: AuthType.Password,
        username,
        password
    });
    __interface = instantiateInterface("webdav", { webdavClient });
}
