import { NativeModules, Platform } from "react-native";
import { EntryFinder } from "../library/buttercupCore";

const { AutoFillBridge } = NativeModules;

export function addSourceToAutoFill(sourceID, archive) {
    return new Promise((resolve, reject) => {
        if (Platform.OS !== "ios" || !AutoFillBridge.DEVICE_SUPPORTS_AUTOFILL) {
            // AutoFill is only implemented on iOS at the moment
            resolve();
            return;
        }

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

                    // Send all general urls so multiple page variants can be matched
                    urls: entry.getURLs("general")
                };
            }
        }

        // Note: Entries are stored against their sourceID in case a source is deleted,
        // that way we can remove from AutoFill without needing to unlock the source (to find the archive ID)
        return AutoFillBridge.updateEntriesForSourceID(sourceID, entries);
    });
}

export function removeSourceFromAutoFill(sourceID) {
    return new Promise((resolve, reject) => {
        if (Platform.OS !== "ios" || !AutoFillBridge.DEVICE_SUPPORTS_AUTOFILL) {
            // AutoFill is only implemented on iOS at the moment
            resolve();
            return;
        }

        return AutoFillBridge.removeEntriesForSourceID(sourceID);
    });
}

export function completeAutoFillWithEntry(entry) {
    // @TODO: Grab Username and Password from the Entry
    return new Promise((resolve, reject) => {
        if (Platform.OS !== "ios" || !AutoFillBridge.DEVICE_SUPPORTS_AUTOFILL) {
            // AutoFill is only implemented on iOS at the moment
            resolve();
            return;
        }

        return AutoFillBridge.completeAutoFill("autofilled", "password123");
    });
}

export function cancelAutoFill() {
    // @TODO: Grab Username and Password from the Entry
    return new Promise((resolve, reject) => {
        if (Platform.OS !== "ios" || !AutoFillBridge.DEVICE_SUPPORTS_AUTOFILL) {
            // AutoFill is only implemented on iOS at the moment
            resolve();
            return;
        }

        return AutoFillBridge.cancelAutoFill();
    });
}
