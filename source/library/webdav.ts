import { AuthType, createClient } from "webdav";

export async function webdavConnectionValid(
    url: string,
    username: string,
    password: string
): Promise<[boolean, string | null]> {
    const client = createClient(url, {
        authType: AuthType.Password,
        username,
        password
    });
    try {
        await client.getDirectoryContents("/");
        return [true, null];
    } catch (err) {
        console.warn(err);
        return [false, `WebDAV connection failed: ${err.message}`];
    }
}
