import { getSharedArchiveManager } from "../library/buttercup.js";
import { EntryFinder } from "../library/buttercupCore"

export async function getMatchingEntriesForSearchTerm(term) {
    const manager = getSharedArchiveManager();
  
    const unlockedSources = manager.unlockedSources;
    const lookup = unlockedSources.reduce(
        (current, next) => ({
            ...current,
            [next.workspace.archive.id]: next.id
        }),
        {}
    );
    const archives = unlockedSources.map(source => source.workspace.archive);
    const finder = new EntryFinder(archives);
      
    return Promise.all(
      finder.search("/" + term + "/").map(async result => {
          const archiveId = lookup[result.archive.id];
          
          return {
              sourceID: archiveId,
              groupID: result.entry.getGroup().id,
              entry: result.entry
            };
        })
    );
}
export function getNameForSource(sourceID) {
    const manager = getSharedArchiveManager();
    const source = manager.getSourceForID(sourceID);
    
    if (!source) {
        throw new Error(`Unable to fetch source information: No source found for ID: ${sourceID}`);
    }
    return source.name;
}