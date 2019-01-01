import { getSharedArchiveManager } from "../library/buttercup.js";
import { EntryFinder } from "../library/buttercupCore.js";
import { getState } from "../store.js";
import { getSelectedArchive } from "../selectors/archiveContents.js";

export function getNameForSource(sourceID) {
    const source = getSharedArchiveManager().getSourceForID(sourceID);
    if (!source) {
        throw new Error(`Unable to fetch source information: No source found for ID: ${sourceID}`);
    }
    return source.name;
}

export function searchAllArchives(term) {
    const manager = getSharedArchiveManager();
    const unlockedSources = manager.unlockedSources;
    const archives = unlockedSources.map(source => source.workspace.archive);
    return searchForEntries(term, archives);
}

export function searchCurrentArchive(term) {
    const archive = getSelectedArchive(getState());
    const archives = archive ? [archive] : [];
    return searchForEntries(term, archives);
}

function searchForEntries(term, archives) {
    const finder = new EntryFinder(archives);
    const manager = getSharedArchiveManager();
    return Promise.all(
        finder.search(term).map(result => {
            const source = manager.unlockedSources.find(
                source => source.workspace.archive.id === result.archive.id
            );
            if (!source) {
                throw new Error(`Failed finding source for archive with ID: ${result.archive.id}`);
            }
            return {
                sourceID: source.id,
                groupID: result.entry.getGroup().id,
                entry: result.entry
            };
        })
    );
}
