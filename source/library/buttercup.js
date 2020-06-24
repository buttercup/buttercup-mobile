import {
    FIELD_VALUE_TYPE_NOTE,
    FIELD_VALUE_TYPE_OTP,
    FIELD_VALUE_TYPE_PASSWORD,
    FIELD_VALUE_TYPE_TEXT,
    Credentials,
    TextDatasource,
    Vault,
    VaultManager,
    VaultSource,
    consumeEntryFacade,
    createEntryFacade
} from "./buttercupCore.js";
import SecureStorageInterface from "../compat/SecureStorageInterface.js";
import { doAsyncWork } from "../global/async.js";

export const FIELD_TYPE_OPTIONS = [
    { type: FIELD_VALUE_TYPE_TEXT, title: "Text (default)" },
    { type: FIELD_VALUE_TYPE_NOTE, title: "Note" },
    { type: FIELD_VALUE_TYPE_PASSWORD, title: "Password" },
    { type: FIELD_VALUE_TYPE_OTP, title: "OTP" }
];

let __sharedManager = null;

/**
 * Add a new archive to the manager
 * @param {String} name The archive name
 * @param {Credentials} credentials Source credentials *instance*
 * @param {String} type Vault type
 * @returns {Promise}
 */
export function addArchiveToArchiveManager(name, credentials, type) {
    const manager = getSharedArchiveManager();
    return doAsyncWork()
        .then(() => credentials.toSecureString())
        .then(credStr => {
            const source = new VaultSource(name, type, credStr);
            return manager.addSource(source);
        });
}

export function createEmptyArchive() {
    return Vault.createWithDefaults();
}

export function createRemoteCredentials(vaultType, options, masterPassword) {
    switch (vaultType) {
        case "dropbox":
            return new Credentials(
                {
                    datasource: {
                        type: "dropbox",
                        token: options.dropboxToken,
                        path: options.path
                    }
                },
                masterPassword
            );
        case "googledrive":
            return new Credentials(
                {
                    datasource: {
                        type: "googledrive",
                        token: options.googleDriveToken,
                        refreshToken: options.googleDriveRefreshToken,
                        fileID: options.path
                    }
                },
                masterPassword
            );
        case "webdav": {
            return new Credentials(
                {
                    datasource: {
                        type: "webdav",
                        endpoint: options.url,
                        path: options.path,
                        username: options.username,
                        password: options.password
                    }
                },
                masterPassword
            );
        }
        default:
            throw new Error(`Unrecognised vault type: ${vaultType}`);
    }
}

export function getArchiveEncryptedContent(vault, credentials) {
    const tds = new TextDatasource(credentials);
    return tds.save(vault.format.history, credentials).then(encryptedContent => {
        return doAsyncWork().then(() => encryptedContent);
    });
}

export function getSharedArchiveManager() {
    if (__sharedManager === null) {
        const storage = new SecureStorageInterface();
        __sharedManager = new VaultManager({
            cacheStorage: storage,
            sourceStorage: storage
        });
    }
    return __sharedManager;
}
