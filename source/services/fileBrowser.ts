import { AuthType, createClient } from "webdav";
import { FileSystemInterface, instantiateInterface } from "@buttercup/file-interface";

let __interface: FileSystemInterface = null;

export function disableCurrentInterface() {
    __interface = null;
}

export function getCurrentInterface(): FileSystemInterface {
    return __interface;
}

export async function prepareWebDAVInterface(
    url: string,
    username: string,
    password: string
): Promise<void> {
    const webdavClient = createClient(url, {
        authType: AuthType.Password,
        username,
        password
    });
    __interface = instantiateInterface("webdav", { webdavClient });
}
