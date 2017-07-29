import { getState } from "../store.js";
import { getSelectedSourceID } from "../selectors/ArchiveContentsPage.js";
import { getSharedArchiveManager } from "../library/buttercup.js";

export function saveCurrentArchive() {
    const state = getState();
    const sourceID = getSelectedSourceID(state);
    const archiveManager = getSharedArchiveManager();
    const sourceIndex = archiveManager.indexOfSource(sourceID);
    return archiveManager
        .sources[sourceIndex]
        .workspace
        .save();
}
