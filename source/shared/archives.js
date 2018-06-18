import { Alert } from "react-native";
import { getSharedArchiveManager } from "../library/buttercup.js";
import { doAsyncWork } from "../global/async.js";
import { dispatch } from "../store.js";
import { showNewPrompt } from "../actions/RemoteExplorerPage.js";

export function beginNewArchiveProcedure() {
    dispatch(showNewPrompt());
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
    const archiveManager = getSharedArchiveManager();
    return archiveManager.removeSource(sourceID);
}
