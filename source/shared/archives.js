import { Alert } from "react-native";
import { getSharedArchiveManager } from "../library/buttercup.js";
import { removeSourceFromAutoFill } from "./autofill";
import { touchIDEnabledForSource, getKeychainCredentialsFromTouchUnlock } from "./touchUnlock";
import { unlockSource } from "../shared/archiveContents";
import { doAsyncWork } from "../global/async.js";
import { dispatch } from "../store.js";
import { showNewPrompt } from "../actions/RemoteExplorerPage.js";

export function beginNewArchiveProcedure() {
    dispatch(showNewPrompt());
}

export function unlockAllTouchEnabledArchives() {
    console.log("unlockAllTouchEnabledArchives", getSharedArchiveManager().sourcesList);

    const sources = getSharedArchiveManager().sourcesList;
    Promise.all(sources.map(source => touchIDEnabledForSource(source.id))).then(results => {
        console.log(results);
        results.forEach((enabled, index) => {
            if (enabled) {
                getKeychainCredentialsFromTouchUnlock().then(keychainCreds => {
                    console.log("passwords", keychainCreds);
                    Object.keys(keychainCreds).forEach(sourceID => {
                        console.log("Source ID", sourceID);
                        unlockSource(sourceID, keychainCreds[sourceID]);
                    });
                });
            }
        });
    });
}

export function lockAllArchives() {
    const archiveManager = getSharedArchiveManager();
    return Promise.all(
        archiveManager.unlockedSources.map(source =>
            archiveManager.getSourceForID(source.id).lock()
        )
    ).then(doAsyncWork);
}

export function promptRemoveArchive(sourceID) {
    const archiveManager = getSharedArchiveManager();
    const source = archiveManager.getSourceForID(sourceID);
    Alert.alert("Remove Archive", `Are you sure that you want to remove '${source.name}'?`, [
        { text: "Cancel", style: "cancel" },
        {
            text: "Delete",
            style: "default",
            onPress: () => {
                removeSource(sourceID);
            }
        }
    ]);
}

export function removeSource(sourceID) {
    // Make sure the source and it's entries are removed from autofill
    removeSourceFromAutoFill(sourceID);

    const archiveManager = getSharedArchiveManager();
    return archiveManager.removeSource(sourceID);
}
