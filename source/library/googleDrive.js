import createClient from "@buttercup/googledrive-client";

// const APP_CLIENT_ID = "5fstmwjaisrt06t";
// const CALLBACK_URL = "https://buttercup.pw/";

const client = new createClient("https://buttercup.pw/5fstmwjaisrt06t");

export function generateAuthorisationURL() {
    return client.getDirectoryContents();
}
