import { createArchiveFacade } from "@buttercup/facades";
import { getSharedArchiveManager } from "../library/buttercup.js";
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
                    title: titleField.value,
                    otpURL: targetField.value
                });
            }
            return allOtpItems;
        }, []);
        return [...output, ...otpItems];
    }, []);
    console.log("OTP", otpEntries);
    dispatch(setOTPCodes(otpEntries));
    // Make sure the updates are reflected in AutoFill as well
    const sourceID = getSelectedSourceID(state);
    autoFillEnabledForSource(sourceID).then(isEnabled => {
        if (isEnabled) {
            addSourceToAutoFill(sourceID, archive);
        }
    });
}
