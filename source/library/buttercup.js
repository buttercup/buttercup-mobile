import {
    FIELD_VALUE_TYPE_NOTE,
    FIELD_VALUE_TYPE_OTP,
    FIELD_VALUE_TYPE_PASSWORD,
    FIELD_VALUE_TYPE_TEXT,
    consumeEntryFacade,
    createEntryFacade
} from "@buttercup/facades";
import {
    Archive,
    ArchiveManager,
    ArchiveSource,
    Datasources,
    Credentials
} from "./buttercupCore.js";
import SecureStorageInterface from "../compat/SecureStorageInterface.js";
import { doAsyncWork } from "../global/async.js";

const { TextDatasource } = Datasources;
const { Status: ArchiveSourceStatus } = ArchiveSource;

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
 * @param {Credentials} sourceCreds Remote source credentials *instance*
 * @param {Credentials} archiveCreds Archive master password credentials *instance*
 * @param {String} archiveType Archive type
 * @returns
 */
export function addArchiveToArchiveManager(name, sourceCreds, archiveCreds, archiveType) {
    const manager = getSharedArchiveManager();
    return doAsyncWork()
        .then(() =>
            Promise.all([
                sourceCreds.toSecureString(archiveCreds.password),
                archiveCreds.toSecureString(archiveCreds.password)
            ])
        )
        .then(([sourceCredString, archiveCredString]) =>
            manager.addSource(
                new ArchiveSource(name, sourceCredString, archiveCredString, { type: archiveType })
            )
        );
}

export function createEmptyArchive() {
    return Archive.createWithDefaults();
}

export function createArchiveCredentials(password) {
    return Credentials.fromPassword(password);
}

export function createRemoteCredentials(archiveType, options) {
    const credentials = new Credentials({ type: archiveType });
    switch (archiveType) {
        case "dropbox":
            credentials.setValue(
                "datasource",
                JSON.stringify({
                    type: "dropbox",
                    token: options.dropboxToken,
                    path: options.path
                })
            );
            return credentials;
        case "googledrive":
            credentials.setValue(
                "datasource",
                JSON.stringify({
                    type: "googledrive",
                    token: options.googleDriveToken,
                    refreshToken: options.googleDriveRefreshToken,
                    fileID: options.path
                })
            );
            return credentials;
        case "nextcloud":
        /* falls-through */
        case "owncloud":
        /* falls-through */
        case "webdav": {
            credentials.username = options.username;
            credentials.password = options.password;
            credentials.setValue(
                "datasource",
                JSON.stringify({
                    type: archiveType,
                    endpoint: options.url,
                    path: options.path
                })
            );
            return credentials;
        }
        default:
            throw new Error(`Unrecognised vault type: ${archiveType}`);
    }
}

export function getArchiveEncryptedContent(archive, credentials) {
    const tds = new TextDatasource();
    return tds.save(archive.getHistory(), credentials).then(encryptedContent => {
        return doAsyncWork().then(() => encryptedContent);
    });
}

export function getSharedArchiveManager() {
    if (__sharedManager === null) {
        __sharedManager = new ArchiveManager(new SecureStorageInterface());
    }
    return __sharedManager;
}

export { ArchiveSourceStatus };
