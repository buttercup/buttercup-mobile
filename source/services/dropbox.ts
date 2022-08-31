import { DropboxClientConfig, generateAuthorisationURL as _generateAuthorisationURL } from "@buttercup/dropbox-client";
import EventEmitter from "eventemitter3";

const APP_CLIENT_ID = "5fstmwjaisrt06t";
const CALLBACK_URL = "buttercup://auth/dropbox/";
export const DROPBOX_CLIENT_CONFIG: DropboxClientConfig = {
    compat:true,
    headers: {
        "Cache-Control": "no-cache, no-store, max-age=0"
    }
};

let __emitter: EventEmitter;

export function generateAuthorisationURL(): string {
    return _generateAuthorisationURL(APP_CLIENT_ID, CALLBACK_URL);
}

export function getEmitter(): EventEmitter {
    if (!__emitter) {
        __emitter = new EventEmitter();
    }
    return __emitter;
}
