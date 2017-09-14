import { dispatch, getState } from "../store.js";
import { createEntryFacade, getSharedArchiveManager } from "../library/buttercup.js";
import { loadEntry as loadNewEntry } from "../actions/entry.js";
import {
    getEntryID,
    getNewMetaKey,
    getNewMetaValue,
    getNewParentID,
    getNewPassword,
    getNewTitle,
    getNewUsername,
    getSourceID
} from "../selectors/entry.js";
import { setSaving } from "../actions/app.js";
import { getSelectedSourceID } from "../selectors/archiveContents.js";
import { handleError } from "../global/exceptions.js";
import { navigateBack } from "../actions/navigation.js";
import { doAsyncWork } from "../global/async.js";
import { updateCurrentArchive } from "./archiveContents.js";

export function getEntry(sourceID, entryID) {
    const archiveManager = getSharedArchiveManager();
    const source = archiveManager.sources[archiveManager.indexOfSource(sourceID)];
    const archive = source.workspace.primary.archive;
    const entry = archive.getEntryByID(entryID);
    return entry;
}

export function getEntryFacade(sourceID, entryID) {
    const entry = getEntry(sourceID, entryID);
    const facade = createEntryFacade(entry);
    return facade;
}

export function getEntryTitle(sourceID, entryID) {
    const entry = getEntry(sourceID, entryID);
    return entry.getProperty("title");
}

export function loadEntry(sourceID, entryID) {
    const facade = getEntryFacade(sourceID, entryID);
    dispatch(loadNewEntry({
        id: entryID,
        fields: facade.fields,
        sourceID
    }));
}

export function saveNewEntry() {
    const state = getState();
    const title = getNewTitle(state);
    const username = getNewUsername(state);
    const password = getNewPassword(state);
    if (title.trim().length <= 0) {
        handleError("Failed saving entry", new Error("Title cannot be empty"));
        return;
    }
    const sourceID = getSelectedSourceID(state);
    const parentGroupID = getNewParentID(state);
    const archiveManager = getSharedArchiveManager();
    const source = archiveManager.sources[archiveManager.indexOfSource(sourceID)];
    const archive = source.workspace.primary.archive;
    const newEntry = archive.findGroupByID(parentGroupID).createEntry(title);
    newEntry
        .setProperty("username", username)
        .setProperty("password", password);
    dispatch(setSaving(true));
    return source.workspace
        .save()
        .then(doAsyncWork)
        .then(() => {
            updateCurrentArchive();
            dispatch(setSaving(false));
            dispatch(navigateBack());
        });
}

export function saveNewMeta() {
    const state = getState();
    const key = getNewMetaKey(state);
    const value = getNewMetaValue(state);
    if (key.trim().length <= 0) {
        handleError("Failed saving meta", new Error("Key cannot be empty"));
        return;
    }
    const sourceID = getSourceID(state);
    const entryID = getEntryID(state);
    const archiveManager = getSharedArchiveManager();
    const source = archiveManager.sources[archiveManager.indexOfSource(sourceID)];
    const archive = source.workspace.primary.archive;
    const entry = archive.getEntryByID(entryID);
    entry.setMeta(key, value);
    dispatch(navigateBack());
    loadEntry(sourceID, entryID);
}
