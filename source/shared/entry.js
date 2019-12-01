import { Alert } from "react-native";
import { createEntryFacade, createFieldDescriptor } from "@buttercup/facades";
import { dispatch, getState } from "../store.js";
import { getSharedArchiveManager } from "../library/buttercup.js";
import { Entry } from "../library/buttercupCore.js";
import { loadEntry as loadNewEntry } from "../actions/entry.js";
import {
    getEntryEditingProperty,
    getEntryFacade as getEntryFacadeFromState,
    getEntryID,
    getNewMetaKey,
    getNewMetaValue,
    getNewMetaValueType,
    getNewParentID,
    getNewPassword,
    getNewTitle,
    getNewUsername,
    getSourceID
} from "../selectors/entry.js";
import { setBusyState } from "../actions/app.js";
import { getSelectedSourceID } from "../selectors/archiveContents.js";
import { handleError } from "../global/exceptions.js";
import { doAsyncWork } from "../global/async.js";
import { updateCurrentArchive } from "./archiveContents.js";
import { saveCurrentArchive } from "../shared/archive.js";
import { getNameForSource } from "./entries";
import { navigateBack } from "./nav.js";
import { simpleCloneObject } from "../library/helpers.js";

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
                        navigateBack();
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

export function saveEntryProperty() {
    const state = getState();
    const {
        originalProperty = null,
        newProperty,
        newValue,
        newValueType
    } = getEntryEditingProperty(state);
    const currentFacade = simpleCloneObject(getEntryFacadeFromState(state));
    const sourceID = getSelectedSourceID(state);
    const entryID = getEntryID(state);
    if (originalProperty) {
        // Edit existing
        const targetField = currentFacade.fields.find(
            field => field.propertyType === "property" && field.property === originalProperty
        );
        targetField.property = newProperty;
        targetField.value = newValue;
        if (newValueType) {
            targetField.valueType = newValueType;
        }
    } else {
        // New field
        const newField = createFieldDescriptor(null, "", "property", newProperty, {
            removeable: true,
            valueType: newValueType
        });
        newField.value = newValue;
        currentFacade.fields.push(newField);
    }
    // Here we load the same entry facade so saving will work, as we don't want
    // to read from the vault but actually use the current facade in memory..
    dispatch(
        loadNewEntry({
            id: entryID,
            facade: currentFacade,
            sourceID
        })
    );
    navigateBack();
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
        navigateBack();
    });
}
