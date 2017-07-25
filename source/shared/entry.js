import { Actions } from "react-native-router-flux";
import { dispatch, getState } from "../store.js";
import { createEntryFacade, getSharedArchiveManager } from "../library/buttercup.js";
import { loadEntry as loadNewEntry } from "../actions/entry.js";
import {
    getEntryID,
    getNewMetaKey,
    getNewMetaValue,
    getSourceID
} from "../selectors/entry.js";
import { handleError } from "../global/exceptions.js";

export function loadEntry(sourceID, entryID) {
    const archiveManager = getSharedArchiveManager();
    const source = archiveManager.sources[archiveManager.indexOfSource(sourceID)];
    const archive = source.workspace.primary.archive;
    const entry = archive.getEntryByID(entryID);
    const facade = createEntryFacade(entry);
    console.log("LOADED FACADE", JSON.parse(JSON.stringify(facade)));
    dispatch(loadNewEntry({
        id: entryID,
        fields: facade.fields,
        sourceID
    }));
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
    console.log("SET", key, value, entry);
    entry.setMeta(key, value);
    console.log("SET'", entry.toObject());
    Actions.pop();
    loadEntry(sourceID, entryID);
}
