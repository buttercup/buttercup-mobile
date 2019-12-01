import extractDomain from "extract-domain";
import { getSharedArchiveManager } from "../library/buttercup.js";
import { EntryFinder } from "../library/buttercupCore.js";
import { dispatch, getState } from "../store.js";
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
                throw new Error(`Failed finding source for vault with ID: ${result.archive.id}`);
            }
            return {
                sourceID: source.id,
                groupID: result.entry.getGroup().id,
                entry: result.entry
            };
        })
    );
}

export function searchAllArchivesForURLs(urls) {
    const manager = getSharedArchiveManager();
    const unlockedSources = manager.unlockedSources;
    const archives = unlockedSources.map(source => source.workspace.archive);
    return getMatchingEntriesForURLs(urls, archives);
}

export function searchCurrentArchiveForURLs(urls) {
    const archive = getSelectedArchive(getState());
    const archives = archive ? [archive] : [];
    return getMatchingEntriesForURLs(urls, archives);
}

export function getMatchingEntriesForURLs(urls, archives) {
    let entries = [];
    urls.forEach(url => {
        getMatchingEntriesForURL(url, archives).forEach(result => {
            // Check for duplicates (e.g. similar URLs may have duplicate results)
            if (!entries.find(_result => result.entry.id === _result.entry.id)) {
                entries.push(result);
            }
        });
    });

    return entries;
}

export function getMatchingEntriesForURL(url, archives) {
    // Source - https://github.com/buttercup/buttercup-browser-extension/blob/3109fc2c788ee0a5f99a28c9cf520ca74f160f0b/source/background/library/archives.js#L280
    const entries = [];
    const manager = getSharedArchiveManager();
    archives.forEach(archive => {
        const source = manager.unlockedSources.find(
            source => source.workspace.archive.id === archive.id
        );
        if (!source) {
            throw new Error(`Failed finding source for vault with ID: ${archive.id}`);
        }
        const newEntries = archive.findEntriesByMeta("url", /.+/).filter(entry => {
            const entryURL = entry.getMeta("url");
            const entryDomain = extractDomain(entryURL);
            return (
                entryDomain.length > 0 &&
                (entryDomain === extractDomain(url) || entryDomain === url) &&
                entry.isInTrash() === false
            );
        });
        entries.push(
            ...newEntries.map(entry => ({
                entry,
                sourceID: source.id
            }))
        );
    });
    return entries;
}
