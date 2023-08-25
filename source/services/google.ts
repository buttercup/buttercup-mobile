import { Linking } from "react-native";
import Config from "react-native-config";
import { DatasourceAuthManager, GoogleDriveDatasource, VaultSourceID } from "buttercup";
import { ERR_REFRESH_FAILED, GoogleToken, OAuth2Client } from "@buttercup/google-oauth2-client";
import { createClient as createGoogleDriveClient } from "@buttercup/googledrive-client";
import { Layerr } from "layerr";
import EventEmitter from "eventemitter3";
import { notifyError, notifySuccess } from "../library/notifications";
import { getEmptyVault } from "./buttercup";
import { GOOGLE_DRIVE_SCOPES_PERMISSIVE, GOOGLE_DRIVE_SCOPES_STANDARD } from "../symbols";
import { GoogleOAuthToken } from "../types";

const CLIENT_WEB = Config.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = Config.GOOGLE_CLIENT_SECRET;

const __updatedTokens: Record<VaultSourceID, GoogleOAuthToken> = {};
let __emitter: EventEmitter;

async function exchangeCodeForTokens(code: string): Promise<GoogleOAuthToken> {
    const client = getClient();
    const {
        tokens: { access_token: accessToken, refresh_token: refreshToken }
    } = await client.exchangeAuthCodeForToken(code);
    return {
        accessToken,
        refreshToken
    };
}

export function generateAuthorisationURL(openPermissions: boolean): string {
    const client = getClient();
    const scopes = openPermissions ? GOOGLE_DRIVE_SCOPES_PERMISSIVE : GOOGLE_DRIVE_SCOPES_STANDARD;
    return client.generateAuthUrl({
        access_type: "offline",
        scope: [...scopes],
        prompt: "consent select_account"
    });
}

function getClient(): OAuth2Client {
    return new OAuth2Client(CLIENT_WEB, CLIENT_SECRET, "https://buttercup.pw/auth/google/");
}

export function getEmitter(): EventEmitter {
    if (!__emitter) {
        __emitter = new EventEmitter();
    }
    return __emitter;
}

export function processCodeExchange(code: string) {
    exchangeCodeForTokens(code)
        .then((token: GoogleOAuthToken) => {
            getEmitter().emit("token", { token });
            for (const sourceID in __updatedTokens) {
                if (__updatedTokens[sourceID] === null) {
                    notifySuccess("Google Drive Re-authorised", "Please unlock vault again");
                    __updatedTokens[sourceID] = token;
                }
            }
        })
        .catch(err => {
            console.error(err);
            notifyError("Google Authentication failed", err.message);
        });
}

export function registerAuthWatchers() {
    DatasourceAuthManager.getSharedManager().registerHandler(
        "googledrive",
        async (datasource: GoogleDriveDatasource) => {
            const { refreshToken: currentRefreshToken, sourceID } =
                datasource as GoogleDriveDatasource;
            const client = getClient();
            let tokens: GoogleToken;
            if (__updatedTokens[sourceID]) {
                datasource.updateTokens(
                    __updatedTokens[sourceID].accessToken,
                    __updatedTokens[sourceID].refreshToken
                );
                delete __updatedTokens[sourceID];
                return;
            } else {
                try {
                    const result = await client.refreshAccessToken(currentRefreshToken);
                    tokens = result.tokens;
                } catch (err) {
                    const { code, status } = Layerr.info(err);
                    if (code === ERR_REFRESH_FAILED && status === 400) {
                        // Start re-authentication procedure
                        __updatedTokens[sourceID] = null;
                        const authURL = generateAuthorisationURL(false);
                        Linking.openURL(authURL);
                        return;
                    }
                    throw err;
                }
            }
            datasource.updateTokens(tokens.access_token, tokens.refresh_token);
        }
    );
}

export async function writeNewEmptyVault(
    accessToken: string,
    parentIdentifier: string | null,
    filename: string,
    password: string
): Promise<string> {
    const emptyVault = await getEmptyVault(password);
    const client = createGoogleDriveClient(accessToken);
    const fileID = await client.putFileContents({
        contents: emptyVault,
        id: null,
        name: filename,
        parent: parentIdentifier
    });
    return fileID;
}
