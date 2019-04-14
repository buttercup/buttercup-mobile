import createClient from "@buttercup/googledrive-client";

const APP_CLIENT_ID = "5fstmwjaisrt06t";
const CALLBACK_URL = "https://buttercup.pw/";

export function generateAuthorisationURL() {
    const client = new createClient({ clientId: APP_CLIENT_ID });

    return client.getDirectoryContents();
}
