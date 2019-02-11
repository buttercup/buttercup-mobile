import { NativeModules, Platform } from "react-native";
import { EntryFinder } from "../library/buttercupCore";
import { getEntryPathString } from "./entry";

const { AutoFillBridge } = NativeModules;

export function addSourceToAutoFill(sourceID, archive) {
    return new Promise((resolve, reject) => {
        if (AutoFillBridge.DEVICE_SUPPORTS_AUTOFILL) {
            // We need to flatten all the Archive Entries, then send them to the native module
            const finder = new EntryFinder([archive]);
            let entries = {}; // Entries will be keyed by ID

            // Create the Map to be sent to the AutoFill store, keyed by credential ID
            for (let entrySearchInfo of finder._items) {
                const entry = entrySearchInfo.entry;
                if (!entry.isInTrash()) {
                    entries[entry.id] = {
                        username: entry.getProperty("username"),
                        password: entry.getProperty("password"),
                        entryPath: getEntryPathString(sourceID, entry.id),
                        // Send all general urls so multiple page variants can be matched
                        urls: entry.getURLs("general")
                    };
                }
            }

            // Note: Entries are stored against their sourceID in case a source is deleted,
            // that way we can remove from AutoFill without needing to unlock the source (to find the archive ID)
            return AutoFillBridge.updateEntriesForSourceID(sourceID, entries);
        }
        resolve();
    });
}

export function removeSourceFromAutoFill(sourceID) {
    return new Promise((resolve, reject) => {
        if (AutoFillBridge.DEVICE_SUPPORTS_AUTOFILL) {
            return AutoFillBridge.removeEntriesForSourceID(sourceID);
        }
        resolve();
    });
}

export function completeAutoFillWithEntry(sourceID, entry) {
    return new Promise((resolve, reject) => {
        if (AutoFillBridge.DEVICE_SUPPORTS_AUTOFILL) {
            const username = entry.getProperty("username");
            const password = entry.getProperty("password");
            const entryPath = getEntryPathString(sourceID, entry.id);
            return AutoFillBridge.completeAutoFill(username, password, entryPath);
        }
        resolve();
    });
}

export function cancelAutoFill() {
    return new Promise((resolve, reject) => {
        if (AutoFillBridge.DEVICE_SUPPORTS_AUTOFILL) {
            return AutoFillBridge.cancelAutoFill();
        }
        resolve();
    });
}
