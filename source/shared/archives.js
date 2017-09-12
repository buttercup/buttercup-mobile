import { getSharedArchiveManager } from "../library/buttercup.js";
import { doAsyncWork } from "../global/async.js";
import { dispatch } from "../store.js";
import { showNewPrompt } from "../actions/RemoteExplorerPage.js";

export function beginNewArchiveProcedure() {
    dispatch(showNewPrompt());
}

export function lockAllArchives() {
    const archiveManager = getSharedArchiveManager();
    return Promise
        .all(archiveManager.unlockedSources.map(source =>
            archiveManager.lock(source.id)
        ))
        .then(doAsyncWork);
}
