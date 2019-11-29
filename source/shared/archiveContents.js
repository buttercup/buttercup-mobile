import { createArchiveFacade } from "@buttercup/facades";
import { getSharedArchiveManager } from "../library/buttercup.js";
import { Group } from "../library/buttercupCore.js";
import { dispatch, getState } from "../store.js";
import { setGroups, setOTPCodes } from "../actions/archiveContents.js";
import { getSelectedArchive } from "../selectors/archiveContents.js";
import { doAsyncWork } from "../global/async.js";
import { setNewEntryParentGroup } from "../actions/entry.js";
import { showArchiveContentsAddItemSheet } from "../shared/sheets.js";
import { autoFillEnabledForSource, addSourceToAutoFill } from "./autofill";
import { getSelectedSourceID } from "../selectors/archiveContents";

const ENTRY_FIELD_OTP_PREFIX = /^BC_ENTRY_FIELD_TYPE:/;

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

function getTopMostFacadeGroup(archiveFacade, groupID, previousGroup = null) {
    if (groupID == "0") {
        return previousGroup;
    }
    const group = archiveFacade.groups.find(grp => grp.id === groupID);
    return getTopMostFacadeGroup(archiveFacade, group.parentID, group);
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
    const archiveFacade = createArchiveFacade(archive);
    // Process groups
    dispatch(setGroups(archiveToObject(archive).groups));
    // Process OTP codes
    const otpEntries = archiveFacade.entries.reduce((output, entry) => {
        // Check if entry is in Trash
        const parentGroup = getTopMostFacadeGroup(archiveFacade, entry.parentID);
        const isTrashGroup =
            parentGroup && parentGroup.attributes[Group.Attributes.Role] === "trash";
        // Ignore deleted entries
        if (isTrashGroup) {
            return output;
        }
        const otpFieldDescriptors = entry.fields.filter(
            field =>
                field.propertyType === "attribute" &&
                ENTRY_FIELD_OTP_PREFIX.test(field.property) &&
                field.value === "otp"
        );
        const otpItems = otpFieldDescriptors.reduce((allOtpItems, nextDesc) => {
            const fieldPropName = nextDesc.property.replace(ENTRY_FIELD_OTP_PREFIX, "");
            const targetField = entry.fields.find(
                entryField =>
                    entryField.propertyType === "property" && entryField.property === fieldPropName
            );
            const titleField = entry.fields.find(
                entryField =>
                    entryField.propertyType === "property" && entryField.property === "title"
            );
            if (targetField && titleField) {
                allOtpItems.push({
                    entryID: entry.id,
                    entryTitle: titleField.value,
                    title: targetField.title || targetField.property,
                    otpURL: targetField.value
                });
            }
            return allOtpItems;
        }, []);
        return [...output, ...otpItems];
    }, []);
    dispatch(setOTPCodes(otpEntries));
    // Make sure the updates are reflected in AutoFill as well
    const sourceID = getSelectedSourceID(state);
    autoFillEnabledForSource(sourceID).then(isEnabled => {
        if (isEnabled) {
            addSourceToAutoFill(sourceID, archive);
        }
    });
}
