import Config from "react-native-config";
import { OAuth2Client } from "@buttercup/google-oauth2-client";
import EventEmitter from "eventemitter3";
import { notifyError } from "../library/notifications";
import { GoogleOAuthToken } from "../types";

const CLIENT_WEB = Config.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = Config.GOOGLE_CLIENT_SECRET;

let __emitter: EventEmitter;

async function exchangeCodeForTokens(code: string): Promise<GoogleOAuthToken> {
    const client = getClient();
    const {
        tokens: {
            access_token: accessToken,
            expiry_date: expiryDate,
            refresh_token: refreshToken,
            token_type: tokenType
        }
    } = await client.exchangeAuthCodeForToken(code);
    return {
        accessToken,
        expiryDate,
        refreshToken,
        tokenType
    };
}

export function generateAuthorisationURL(): string {
    const client = getClient();
    return client.generateAuthUrl({
        access_type: "offline",
        scope: "profile email https://www.googleapis.com/auth/drive.file",
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
        })
        .catch(err => {
            console.error(err);
            notifyError("Google Authentication failed", err.message);
        });
}
