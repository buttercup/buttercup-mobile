import { getState } from "../store.js";
import { getSelectedSourceID } from "../selectors/archiveContents.js";
import { getSharedArchiveManager } from "../library/buttercup.js";
import { doAsyncWork } from "../global/async.js";

export function saveCurrentArchive(overrideWorkspace = null) {
    let workspace;
    if (overrideWorkspace) {
        workspace = overrideWorkspace;
    } else {
        const state = getState();
        const sourceID = getSelectedSourceID(state);
        const archiveManager = getSharedArchiveManager();
        workspace = archiveManager.getSourceForID(sourceID).workspace;
    }
    return workspace
        .localDiffersFromRemote()
        .then(differs => (differs ? workspace.mergeSaveablesFromRemote().then(() => true) : false))
        .then(shouldSave => (shouldSave ? workspace.save() : null))
        .then(doAsyncWork);
}
