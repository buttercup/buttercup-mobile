import { Dropbox } from "dropbox";
import Browser from "react-native-browser";

const APP_CLIENT_ID = "5fstmwjaisrt06t";
const CALLBACK_URL = "https://buttercup.pw/";

export function generateAuthorisationURL() {
    const client = new Dropbox({ clientId: APP_CLIENT_ID });
    return client.getAuthenticationUrl(CALLBACK_URL);
}
