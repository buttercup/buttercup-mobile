import { Alert } from "react-native";
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
import { setBusyState } from "../actions/app.js";
import { getSelectedSourceID } from "../selectors/archiveContents.js";
import { handleError } from "../global/exceptions.js";
import { navigateBack } from "../actions/navigation.js";
import { doAsyncWork } from "../global/async.js";
import { updateCurrentArchive } from "./archiveContents.js";
import { saveCurrentArchive } from "../shared/archive.js";
import { getNameForSource } from "./entries";

export function deleteEntry(sourceID, entryID) {
    const entry = getEntry(sourceID, entryID);
    entry.delete();
}

export function getEntry(sourceID, entryID) {
    const archiveManager = getSharedArchiveManager();
    const { archive } = archiveManager.getSourceForID(sourceID).workspace;
    const entry = archive.findEntryByID(entryID);
    return entry;
}

export function getEntryFacade(sourceID, entryID) {
    const entry = getEntry(sourceID, entryID);
    return createEntryFacade(entry);
}

export function getEntryTitle(sourceID, entryID) {
    const entry = getEntry(sourceID, entryID);
    return entry.getProperty("title");
}

export function getEntryPath(sourceID, entryID) {
    const entry = getEntry(sourceID, entryID);
    let group = entry.getGroup(),
        entryPath = [group];
    let parent;
    while ((parent = group.getGroup()) !== null) {
        entryPath.unshift(parent);
        group = parent;
    }
    return entryPath.map(pathGroup => pathGroup.getTitle());
}

export function getEntryPathString(sourceID, entryID) {
    let entryPath = getNameForSource(sourceID) + " > ";
    getEntryPath(sourceID, entryID).forEach((group, index) => {
        if (index > 0) entryPath += " > ";
        entryPath += group;
    });
    return entryPath;
}

export function loadEntry(sourceID, entryID) {
    const facade = getEntryFacade(sourceID, entryID);
    dispatch(
        loadNewEntry({
            id: entryID,
            facade,
            sourceID
        })
    );
}

export function promptDeleteEntry() {
    const state = getState();
    const sourceID = getSourceID(state);
    const entryID = getEntryID(state);
    const entry = getEntry(sourceID, entryID);
    const title = entry.getProperty("title");
    Alert.alert("Delete Entry", `Are you sure that you want to delete the entry '${title}'?`, [
        { text: "Cancel", style: "cancel" },
        {
            text: "Delete",
            style: "default",
            onPress: () => {
                dispatch(setBusyState("Saving"));
                Promise.resolve()
                    .then(() => deleteEntry(sourceID, entryID))
                    .then(() => saveCurrentArchive())
                    .then(() => {
                        dispatch(setBusyState(null));
                        dispatch(navigateBack());
                        updateCurrentArchive();
                    })
                    .catch(err => {
                        dispatch(setBusyState(null));
                        handleError("Failed deleting entry", err);
                    });
            }
        }
    ]);
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
    const source = archiveManager.getSourceForID(sourceID);
    const archive = source.workspace.archive;
    const newEntry = archive.findGroupByID(parentGroupID).createEntry(title);
    newEntry.setProperty("username", username).setProperty("password", password);
    dispatch(setBusyState("Saving"));
    return saveCurrentArchive(source.workspace).then(() => {
        updateCurrentArchive();
        dispatch(setBusyState(null));
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
    const source = archiveManager.getSourceForID(sourceID);
    const archive = source.workspace.archive;
    const entry = archive.findEntryByID(entryID);
    entry.setMeta(key, value);
    dispatch(navigateBack());
    loadEntry(sourceID, entryID);
}
