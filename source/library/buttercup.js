import {
    Archive,
    ArchiveManager,
    TextDatasource,
    createCredentials,
    entryFacade
} from "buttercup/dist/buttercup-web.min";
import AsyncStorageInterface from "../compat/AsyncStorageInterface.js";
import { doAsyncWork } from "../global/async.js";

const { SourceStatus: ArchiveSourceStatus } = ArchiveManager;

let __sharedManager = null;

export function addArchiveToArchiveManager(name, sourceCreds, archiveCreds) {
    const manager = getSharedArchiveManager();
    return doAsyncWork().then(() => manager.addSource(name, sourceCreds, archiveCreds));
}

export function consumeEntryFacade(entry, facade) {
    entryFacade.consumeEntryFacade(entry, facade);
}

export function createEmptyArchive() {
    return Archive.createWithDefaults();
}

export function createArchiveCredentials(password) {
    return createCredentials.fromPassword(password);
}

export function createEntryFacade(entry) {
    return entryFacade.createEntryFacade(entry);
}

export function createRemoteCredentials(archiveType, options) {
    const credentials = createCredentials(archiveType);
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
