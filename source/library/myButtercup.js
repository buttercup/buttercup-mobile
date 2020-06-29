import { Credentials, MyButtercupClient } from "./buttercupCore.js";
import { setBrowserURL } from "../actions/browser.js";
import { dispatch, getState } from "../store.js";
import { getAccessToken, getRefreshToken } from "../selectors/myButtercup.js";
import { navigate, POPUP_BROWSER_SCREEN } from "../shared/nav.js";
import { addArchiveToArchiveManager } from "./buttercup.js";

export const MYBUTTERCUP_CLIENT_ID = "bcup_mobile";
export const MYBUTTERCUP_CLIENT_SECRET = "5687c89af1f9b6e81c57937f55f4537a";
export const MYBUTTERCUP_REDIRECT_URI = "https://my.buttercup.pw/oauth/authorized/";
// export const MYBUTTERCUP_REDIRECT_URI = "http://localhost:8000/oauth/authorized/";

export function authenticate() {
    const authURL = MyButtercupClient.generateAuthorisationURL(MYBUTTERCUP_CLIENT_ID);
    dispatch(setBrowserURL(authURL));
    navigate(POPUP_BROWSER_SCREEN, { title: "My Buttercup" });
}

export function connectVault(masterPassword) {
    const state = getState();
    const accessToken = getAccessToken(state);
    const refreshToken = getRefreshToken(state);
    return processNewVaultDetails(accessToken, refreshToken).then(({ id, name }) => {
        const credentials = Credentials.fromDatasource(
            {
                type: "mybuttercup",
                accessToken,
                clientID: MYBUTTERCUP_CLIENT_ID,
                clientSecret: MYBUTTERCUP_CLIENT_SECRET,
                refreshToken,
                vaultID: id
            },
            masterPassword
        );
        return addArchiveToArchiveManager(name, credentials, "mybuttercup");
    });
}

/**
 * Exchange an auth code for tokens
 * @param {String} authCode The authorisation code
 * @returns {Promise.<{ accessToken: String, refreshToken: String }>}
 */
export function getTokens(authCode) {
    console.log("GET TOKENS FOR CODE", authCode);
    return MyButtercupClient.exchangeAuthCodeForTokens(
        authCode,
        MYBUTTERCUP_CLIENT_ID,
        MYBUTTERCUP_CLIENT_SECRET,
        MYBUTTERCUP_REDIRECT_URI
    );
}

function processNewVaultDetails(accessToken, refreshToken) {
    const client = new MyButtercupClient(
        MYBUTTERCUP_CLIENT_ID,
        MYBUTTERCUP_CLIENT_SECRET,
        accessToken,
        refreshToken
    );
    return Promise.all([client.fetchUserVaultDetails(), client.retrieveDigest()]).then(
        ([details, digest]) => {
            const { id } = details;
            const { account_name: name } = digest;
            return { id, name };
        }
    );
}
