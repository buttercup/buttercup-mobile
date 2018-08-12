import { getSharedArchiveManager } from "../library/buttercup.js";
import { setArchives } from "../actions/archives.js";
import { updateTouchEnabledSources } from "../shared/touchUnlock.js";

export function linkArchiveManagerToStore(store) {
    const { dispatch } = store;
    const archiveManager = getSharedArchiveManager();
    // listen for new archives
    archiveManager.on("sourcesUpdated", sourcesList => {
        const sources = sourcesList.map(sourceInfo => ({
            ...sourceInfo,
            readOnly:
                sourceInfo.status === "unlocked" &&
                archiveManager.getSourceForID(sourceInfo.id).workspace.archive.readOnly
        }));
        dispatch(setArchives(sources));
        updateTouchEnabledSources();
    });
}
