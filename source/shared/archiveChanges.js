import { getSharedArchiveManager } from "../library/buttercup.js";
import { setArchives } from "../actions/archives.js";
import { updateTouchEnabledSources } from "../shared/touchUnlock.js";
import { VaultSource } from "../library/buttercupCore.js";
// import { updateSearch } from "./search.js";

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
                source.status === VaultSource.STATUS_UNLOCKED &&
                manager.getSourceForID(source.id).vault.readOnly
        }));
        dispatch(setArchives(sources));
        updateTouchEnabledSources();
        // updateSearch(manager.unlockedSources.map(source => source.vault));
    });
}
