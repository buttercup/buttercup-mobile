import { getSharedArchiveManager } from "../library/buttercup.js";
import { dispatch, getState } from "../store.js";
import { setGroups } from "../actions/ArchiveContentsPage.js";
import { getSelectedArchive } from "../selectors/ArchiveContentsPage.js";
import { doAsyncWork } from "../global/async.js";
import { setNewEntryParentGroup } from "../actions/entry.js";
import { showArchiveContentsAddItemSheet } from "../shared/sheets.js";

export function addToGroup(groupID) {
    dispatch(setNewEntryParentGroup(groupID));
    const showEntryAdd = groupID !== "0";
    showArchiveContentsAddItemSheet(showEntryAdd);
}

export function archiveToObject(archive) {
    return archive.toObject();
}

export function lockSource(sourceID) {
    const archiveManager = getSharedArchiveManager();
    return archiveManager.lock(sourceID);
}

export function removeSource(sourceID) {
    const archiveManager = getSharedArchiveManager();
    return archiveManager.remove(sourceID);
}

export function unlockSource(sourceID, password) {
    const archiveManager = getSharedArchiveManager();
    return doAsyncWork()
        .then(() => archiveManager.unlock(sourceID, password));
}

export function updateCurrentArchive() {
    const state = getState();
    const archive = getSelectedArchive(state);
    dispatch(
        setGroups(archiveToObject(archive).groups)
    );
}
