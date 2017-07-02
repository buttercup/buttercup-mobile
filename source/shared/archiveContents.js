import { getSharedArchiveManager } from "../library/buttercup.js";
import { dispatch, getState } from "../store.js";
import { setGroups } from "../actions/ArchiveContentsPage.js";
import { loadEntry as loadNewEntry } from "../actions/entry.js";
import { getSelectedArchive } from "../selectors/ArchiveContentsPage.js";

export function archiveToObject(archive) {
    return archive.toObject();
}

export function loadEntry(sourceID, entryID) {
    const archiveManager = getSharedArchiveManager();
    const source = archiveManager.sources[archiveManager.indexOfSource(sourceID)];
    const archive = source.workspace.primary.archive;
    const entry = archive.getEntryByID(entryID).toObject();
    dispatch(loadNewEntry({
        ...entry,
        sourceID
    }));
}

export function removeSource(sourceID) {
    const archiveManager = getSharedArchiveManager();
    return archiveManager.remove(sourceID);
}

export function unlockSource(sourceID, password) {
    const archiveManager = getSharedArchiveManager();
    return archiveManager.unlock(sourceID, password);
}

export function updateCurrentArchive() {
    const state = getState();
    const archive = getSelectedArchive(state);
    dispatch(
        setGroups(archiveToObject(archive).groups)
    );
}
