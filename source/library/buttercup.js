import {
    Archive,
    ArchiveManager,
    ArchiveSource,
    Datasources,
    Credentials,
    entryFacade
} from "./buttercupCore.js";
import AsyncStorageInterface from "../compat/AsyncStorageInterface.js";
import { doAsyncWork } from "../global/async.js";

const { TextDatasource } = Datasources;
const { Status: ArchiveSourceStatus } = ArchiveSource;

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

export function consumeEntryFacade(entry, facade) {
    entryFacade.consumeEntryFacade(entry, facade);
}

export function createEmptyArchive() {
    return Archive.createWithDefaults();
}

export function createArchiveCredentials(password) {
    return Credentials.fromPassword(password);
}

export function createEntryFacade(entry) {
    return entryFacade.createEntryFacade(entry);
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
            throw new Error(`Unrecognised archive type: ${archiveType}`);
    }
}

export function getArchiveEncryptedContent(archive, credentials) {
    const tds = new TextDatasource();
    return tds.save(archive, credentials).then(encryptedContent => {
        return doAsyncWork().then(() => encryptedContent);
    });
}

export function getSharedArchiveManager() {
    if (__sharedManager === null) {
        __sharedManager = new ArchiveManager(new AsyncStorageInterface());
    }
    return __sharedManager;
}

export { ArchiveSourceStatus };
