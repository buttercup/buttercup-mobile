import { Platform } from "react-native";
import ActionSheet from "@yfuks/react-native-action-sheet";
import { lockAllArchives } from "./archives.js";
import { promptDeleteGroup } from "./group.js";
import { getState, dispatch } from "../store.js";
import { handleError } from "../global/exceptions.js";
import {
    navigateToAddArchive,
    navigateToNewEntry,
    navigateToSearchArchives
} from "../actions/navigation.js";
import { showCreateGroupPrompt, showGroupRenamePrompt } from "../actions/archiveContents.js";
import { getSelectedSourceID, isCurrentlyReadOnly } from "../selectors/archiveContents.js";
import {
    disableTouchUnlock,
    enableTouchUnlock,
    touchIDAvailable,
    touchIDEnabledForSource
} from "./touchUnlock.js";
import {
    autoFillAvailable,
    getAutoFillSystemStatus,
    openAutoFillSystemSettings,
    autoFillEnabledForSource,
    addSourceToAutoFill,
    removeSourceFromAutoFill
} from "./autofill";
import { getSelectedArchive } from "../selectors/archiveContents";

const SHEET_ADD_ARCHIVE = "Add";
const SHEET_ADD_ENTRY = "New Entry";
const SHEET_ADD_GROUP = "New Group";
const SHEET_CANCEL = "Cancel";
const SHEET_DELETE_GROUP = "Delete Group";
const SHEET_LOCK_ALL = "Lock All";
const SHEET_RENAME_GROUP = "Rename Group";
const SHEET_TOGGLE_TOUCH_ID = "Toggle Touch Unlock";
const SHEET_TOGGLE_AUTOFILL = "Toggle Autofill";
const SHEET_SEARCH_CURRENT_ARCHIVE = "Search Archive";

const ARCHIVE_CONTENTS_ADD_ITEM_SHEET_BUTTONS = [
    SHEET_ADD_ENTRY,
    SHEET_ADD_GROUP,
    SHEET_DELETE_GROUP,
    SHEET_RENAME_GROUP,
    SHEET_TOGGLE_TOUCH_ID,
    SHEET_TOGGLE_AUTOFILL,
    SHEET_CANCEL,
    SHEET_SEARCH_CURRENT_ARCHIVE
];
const ARCHIVES_PAGE_RIGHT_SHEET_BUTTONS = [SHEET_ADD_ARCHIVE, SHEET_LOCK_ALL, SHEET_CANCEL];

function removeTextFromArray(arr, text) {
    const ind = arr.indexOf(text);
    if (ind >= 0) {
        arr.splice(ind, 1);
    }
}

export function showArchiveContentsAddItemSheet(isRoot, showEntryAdd, showEditGroup) {
    const buttons = [...ARCHIVE_CONTENTS_ADD_ITEM_SHEET_BUTTONS];
    const title = isRoot ? "Manage Archive" : "Edit Group";
    const state = getState();
    const readOnly = isCurrentlyReadOnly(state);
    return Promise.all([touchIDAvailable()]).then(([touchIDAvailable]) => {
        if (!showEntryAdd) {
            removeTextFromArray(buttons, SHEET_ADD_ENTRY);
        }
        if (!showEditGroup) {
            removeTextFromArray(buttons, SHEET_RENAME_GROUP);
            removeTextFromArray(buttons, SHEET_DELETE_GROUP);
        }
        if (!isRoot || !touchIDAvailable) {
            removeTextFromArray(buttons, SHEET_TOGGLE_TOUCH_ID);
        }
        if (!isRoot || !autoFillAvailable) {
            removeTextFromArray(buttons, SHEET_TOGGLE_AUTOFILL);
        }
        if (readOnly) {
            removeTextFromArray(buttons, SHEET_ADD_GROUP);
            removeTextFromArray(buttons, SHEET_ADD_ENTRY);
            removeTextFromArray(buttons, SHEET_RENAME_GROUP);
            removeTextFromArray(buttons, SHEET_DELETE_GROUP);
        }
        ActionSheet.showActionSheetWithOptions(
            {
                options: buttons,
                cancelButtonIndex: buttons.indexOf(SHEET_CANCEL),
                title
            },
            selectedIndex => {
                switch (buttons[selectedIndex]) {
                    case SHEET_ADD_ENTRY: {
                        dispatch(navigateToNewEntry());
                        break;
                    }
                    case SHEET_ADD_GROUP: {
                        dispatch(showCreateGroupPrompt(true));
                        break;
                    }
                    case SHEET_DELETE_GROUP: {
                        promptDeleteGroup();
                        break;
                    }
                    case SHEET_RENAME_GROUP: {
                        dispatch(showGroupRenamePrompt(true));
                        break;
                    }
                    case SHEET_TOGGLE_TOUCH_ID: {
                        showTouchIDToggleSheet();
                        break;
                    }
                    case SHEET_TOGGLE_AUTOFILL: {
                        showAutoFillToggleSheet();
                        break;
                    }
                    case SHEET_SEARCH_CURRENT_ARCHIVE: {
                        dispatch(navigateToSearchArchives());
                        break;
                    }
                }
            }
        );
    });
}

export function showArchivesPageRightSheet() {
    ActionSheet.showActionSheetWithOptions(
        {
            options: ARCHIVES_PAGE_RIGHT_SHEET_BUTTONS,
            cancelButtonIndex: ARCHIVES_PAGE_RIGHT_SHEET_BUTTONS.indexOf(SHEET_CANCEL),
            title: "Archives"
        },
        selectedIndex => {
            switch (ARCHIVES_PAGE_RIGHT_SHEET_BUTTONS[selectedIndex]) {
                case SHEET_ADD_ARCHIVE: {
                    dispatch(navigateToAddArchive());
                    break;
                }
                case SHEET_LOCK_ALL: {
                    lockAllArchives();
                    break;
                }
            }
        }
    );
}

export function showTouchIDToggleSheet() {
    const state = getState();
    const currentSourceID = getSelectedSourceID(state);
    const itemEnableTouchID = "Enable Touch Unlock";
    const itemDisableTouchID = "Disable Touch Unlock";
    const itemCancel = "Cancel";
    return touchIDEnabledForSource(currentSourceID).then(enabled => {
        const options = [enabled ? itemDisableTouchID : itemEnableTouchID, itemCancel];
        ActionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex: options.indexOf(itemCancel),
                title: "Touch Unlock"
            },
            selectedIndex => {
                switch (options[selectedIndex]) {
                    case itemEnableTouchID: {
                        enableTouchUnlock(currentSourceID).then(outcome => {
                            switch (outcome.action) {
                                case "none":
                                /* falls-through */
                                case "cancel":
                                    // do nothing
                                    break;
                                case "fallback":
                                    handleError(
                                        "Failed enabling touch unlock",
                                        new Error(
                                            "Password not supported for enabling touch unlock"
                                        )
                                    );
                                    break;
                                default:
                                    handleError(
                                        "Failed enabling touch unlock",
                                        new Error("Unrecognised touch unlock response")
                                    );
                                    break;
                            }
                        });
                        break;
                    }
                    case itemDisableTouchID: {
                        disableTouchUnlock(currentSourceID);
                        break;
                    }
                }
            }
        );
    });
}

export function showAutoFillToggleSheet() {
    const state = getState();
    const currentSourceID = getSelectedSourceID(state);
    const itemEnableAutoFill = "Enable Autofill";
    const itemDisableAutoFill = "Disable Autofill";
    const itemSystemSettings = (Platform.OS === "ios" ? "iOS" : "Android") + " Settings";
    const itemCancel = "Cancel";
    return Promise.all([getAutoFillSystemStatus(), autoFillEnabledForSource(currentSourceID)]).then(
        results => {
            const autoFillEnabled = results[0];
            const archiveEnabled = results[1];

            const options = [archiveEnabled ? itemDisableAutoFill : itemEnableAutoFill];
            // We are only able to detect if AutoFill is enabled on Android, and furthermore we cannot
            // open the Android autofill settings if autofill is already set to buttercup

            // On iOS we always show the option to open system settings as there is no way
            // to detect if the user has enabled it
            if ((Platform.OS === "android" && !autoFillEnabled) || Platform.OS === "ios") {
                options.push(itemSystemSettings);
            }
            // Finally add the cancel button
            options.push(itemCancel);
            ActionSheet.showActionSheetWithOptions(
                {
                    options,
                    cancelButtonIndex: options.indexOf(itemCancel),
                    title: "Autofill"
                },
                selectedIndex => {
                    switch (options[selectedIndex]) {
                        case itemEnableAutoFill: {
                            const archive = getSelectedArchive(state);
                            // We need to check if AutoFill is enabled,
                            // if not we need to open the system permissions
                            if (!autoFillEnabled) {
                                openAutoFillSystemSettings().then(() => {
                                    addSourceToAutoFill(currentSourceID, archive);
                                });
                            } else {
                                addSourceToAutoFill(currentSourceID, archive);
                            }
                            break;
                        }
                        case itemSystemSettings: {
                            openAutoFillSystemSettings().then(() => {
                                // Reopen these settings when the user returns
                                showAutoFillToggleSheet();
                            });
                            break;
                        }
                        case itemDisableAutoFill: {
                            removeSourceFromAutoFill(currentSourceID);
                            break;
                        }
                    }
                }
            );
        }
    );
}
