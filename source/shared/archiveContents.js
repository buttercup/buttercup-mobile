import { getSharedArchiveManager } from "../library/buttercup.js";
import { dispatch, getState } from "../store.js";
import { setGroups } from "../actions/archiveContents.js";
import { getSelectedArchive } from "../selectors/archiveContents.js";
import { doAsyncWork } from "../global/async.js";
import { setNewEntryParentGroup } from "../actions/entry.js";
import { showArchiveContentsAddItemSheet } from "../shared/sheets.js";
import { addSourceToAutoFill } from "./autofill";
import { getSelectedSourceID } from "../selectors/archiveContents";

export function archiveToObject(archive) {
    return archive.toObject();
}

export function checkSourceHasOfflineCopy(sourceID) {
    const source = getSharedArchiveManager().getSourceForID(sourceID);
    return source.checkOfflineCopy();
}

export function editGroup(groupID) {
    dispatch(setNewEntryParentGroup(groupID));
    const showEntryAdd = groupID !== "0";
    const showEditGroup = groupID !== "0";
    showArchiveContentsAddItemSheet(/* is root */ groupID === "0", showEntryAdd, showEditGroup);
}

export function getSourceReadonlyStatus(sourceID) {
    return getSharedArchiveManager().getSourceForID(sourceID).workspace.archive.readOnly;
}

export function lockSource(sourceID) {
    const archiveManager = getSharedArchiveManager();
    return archiveManager.getSourceForID(sourceID).lock();
}

export function unlockSource(sourceID, password, useOffline = false) {
    const archiveManager = getSharedArchiveManager();
    return doAsyncWork().then(() =>
        archiveManager.getSourceForID(sourceID).unlock(password, /* init: */ false, useOffline)
    );
}

export function updateCurrentArchive() {
    const state = getState();
    const archive = getSelectedArchive(state);

    dispatch(setGroups(archiveToObject(archive).groups));

    // Make sure the updates are reflected in AutoFill as well
    const sourceID = getSelectedSourceID(state);
    addSourceToAutoFill(sourceID, archive);
}
