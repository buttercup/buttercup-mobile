import { getSharedArchiveManager } from "../library/buttercup.js";
import { Credentials, Group, createVaultFacade } from "../library/buttercupCore.js";
import { dispatch, getState } from "../store.js";
import { setGroups } from "../actions/archiveContents.js";
import { setOTPCodes } from "../actions/archives.js";
import { getSelectedArchive } from "../selectors/archiveContents.js";
import { doAsyncWork } from "../global/async.js";
import { setNewEntryParentGroup } from "../actions/entry.js";
import { showArchiveContentsAddItemSheet } from "../shared/sheets.js";
import { autoFillEnabledForSource, addSourceToAutoFill } from "./autofill";
import { getSelectedSourceID } from "../selectors/archiveContents";

const ENTRY_FIELD_OTP_PREFIX = /^BC_ENTRY_FIELD_TYPE:/;

export function checkSourceHasOfflineCopy(sourceID) {
    const source = getSharedArchiveManager().getSourceForID(sourceID);
    return source.checkOfflineCopy();
}

export function editGroup(groupID) {
    dispatch(setNewEntryParentGroup(groupID));
    showArchiveContentsAddItemSheet(groupID);
}

export function getSourceReadonlyStatus(sourceID) {
    return getSharedArchiveManager().getSourceForID(sourceID).vault.readOnly;
}

function getTopMostFacadeGroup(vaultFacade, groupID, previousGroup = null) {
    if (groupID == "0") {
        return previousGroup;
    }
    const group = vaultFacade.groups.find(grp => grp.id === groupID);
    return getTopMostFacadeGroup(vaultFacade, group.parentID, group);
}

export function lockSource(sourceID) {
    const manager = getSharedArchiveManager();
    return manager.getSourceForID(sourceID).lock();
}

export function unlockSource(sourceID, password, useOffline = false) {
    const manager = getSharedArchiveManager();
    const credentials = Credentials.fromPassword(password);
    return doAsyncWork().then(() =>
        manager.getSourceForID(sourceID).unlock(credentials, {
            loadOfflineCopy: useOffline,
            storeOfflineCopy: !useOffline
        })
    );
}

function updateAllVaultCodes() {
    const unlockedVaults = getSharedArchiveManager().unlockedSources.map(source => ({
        source,
        vault: source.vault
    }));
    const otpGroups = [];
    unlockedVaults.forEach(({ source, vault }) => {
        const vaultFacade = createVaultFacade(vault);
        const otpEntries = vaultFacade.entries.reduce((output, entry) => {
            // Check if entry is in Trash
            const parentGroup = getTopMostFacadeGroup(vaultFacade, entry.parentID);
            const isTrashGroup =
                parentGroup && parentGroup.attributes[Group.Attribute.Role] === "trash";
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
                        entryField.propertyType === "property" &&
                        entryField.property === fieldPropName
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
        if (otpEntries.length > 0) {
            otpGroups.push({
                entries: otpEntries,
                sourceTitle: source.name,
                sourceID: source.id,
                sourceOrder: source.order
            });
        }
    });
    dispatch(setOTPCodes(otpGroups));
}

export function updateCurrentArchive() {
    const state = getState();
    const vault = getSelectedArchive(state);
    // Process groups
    dispatch(setGroups(createVaultFacade(vault).groups || []));
    // Process OTP codes
    updateAllVaultCodes();
    // Make sure the updates are reflected in AutoFill as well
    const sourceID = getSelectedSourceID(state);
    autoFillEnabledForSource(sourceID).then(isEnabled => {
        if (isEnabled) {
            addSourceToAutoFill(sourceID, vault);
        }
    });
}
