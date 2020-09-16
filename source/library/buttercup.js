import {
    Credentials,
    EntryPropertyValueType,
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
    { type: EntryPropertyValueType.Text, title: "Text (default)" },
    { type: EntryPropertyValueType.Note, title: "Note" },
    { type: EntryPropertyValueType.Password, title: "Password" },
    { type: EntryPropertyValueType.OTP, title: "OTP" }
];

let __sharedManager = null;

/**
 * Add a new archive to the manager
 * @param {String} name The archive name
 * @param {Credentials} credentials Source credentials *instance*
 * @param {String} type Vault type
 * @returns {Promise}
 */
export async function addArchiveToArchiveManager(name, credentials, type, initialise = false) {
    const manager = getSharedArchiveManager();
    await doAsyncWork();
    const credStr = await credentials.toSecureString();
    const source = new VaultSource(name, type, credStr);
    await manager.addSource(source);
    await source.unlock(credentials, {
        initialiseRemote: initialise
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
                        endpoint: options.endpoint,
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
