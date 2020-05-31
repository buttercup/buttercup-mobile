import { getSharedArchiveManager } from "../library/buttercup.js";
import { setArchives } from "../actions/archives.js";
import { updateTouchEnabledSources } from "../shared/touchUnlock.js";

export function linkArchiveManagerToStore(store) {
    const { dispatch } = store;
    const manager = getSharedArchiveManager();
    // listen for new archives
    manager.on("sourcesUpdated", () => {
        const sources = manager.sources.map(source => ({
            id: source.id,
            name: source.name,
            status: source.status,
            type: source.type,
            readOnly:
                sourceInfo.status === "unlocked" &&
                manager.getSourceForID(sourceInfo.id).vault.readOnly
        }));
        dispatch(setArchives(sources));
        updateTouchEnabledSources();
    });
}
