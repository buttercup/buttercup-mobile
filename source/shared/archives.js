import { getSharedArchiveManager } from "../library/buttercup.js";

export function lockAllArchives() {
    const archiveManager = getSharedArchiveManager();
    return Promise.all(archiveManager.unlockedSources.map(source =>
        archiveManager.lock(source.id)
    ));
}
