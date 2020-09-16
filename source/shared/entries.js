import extractDomain from "extract-domain";
import i18n from "../shared/i18n";
import { getSharedArchiveManager } from "../library/buttercup.js";
import { dispatch, getState } from "../store.js";
// import { getSearch, updateSearch } from "./search.js";
import { getSelectedArchive } from "../selectors/archiveContents.js";

// const ENTRY_URL_REXP = /^(login ?)?ur[il]$/i;

// export function getNameForSource(sourceID) {
//     const source = getSharedArchiveManager().getSourceForID(sourceID);
//     if (!source) {
//         throw new Error(i18n.t("vaults.errors.unable-to-fetch-source", { sourceID }));
//     }
//     return source.name;
// }

// export function searchAllArchives(term) {
//     const manager = getSharedArchiveManager();
//     const unlockedSources = manager.unlockedSources;
//     const vaults = unlockedSources.map(source => source.vault);
//     return searchForEntries(term, vaults);
// }

// export function searchCurrentArchive(term) {
//     const archive = getSelectedArchive(getState());
//     const archives = archive ? [archive] : [];
//     return searchForEntries(term, archives);
// }

// function searchForEntries(term, archives) {
//     const finder = new EntryFinder(archives);
//     const manager = getSharedArchiveManager();
//     return Promise.all(
//         finder.search(term).map(result => {
//             const source = manager.unlockedSources.find(
//                 source => source.vault.id === result.archive.id
//             );
//             if (!source) {
//                 throw new Error(
//                     i18n.t("vault.errors.failed-finding-source", { id: result.archive.id })
//                 );
//             }
//             return {
//                 sourceID: source.id,
//                 groupID: result.entry.getGroup().id,
//                 entry: result.entry
//             };
//         })
//     );
// }

// export function searchAllArchivesForURLs(urls) {
//     const manager = getSharedArchiveManager();
//     const vaults = manager.unlockedSources.map(source => source.vault);
//     return getMatchingEntriesForURLs(urls, vaults);
// }

// export function searchCurrentArchiveForURLs(urls) {
//     const vault = getSelectedArchive(getState());
//     const vaults = vault ? [vault] : [];
//     return getMatchingEntriesForURLs(urls, vaults);
// }

// export function getMatchingEntriesForURLs(urls, vaults) {
//     let entries = [];
//     urls.forEach(url => {
//         getMatchingEntriesForURL(url, vaults).forEach(result => {
//             // Check for duplicates (e.g. similar URLs may have duplicate results)
//             if (!entries.find(_result => result.entry.id === _result.entry.id)) {
//                 entries.push(result);
//             }
//         });
//     });

//     return entries;
// }

// export function getMatchingEntriesForURL(url, vaults) {
//     const entries = [];
//     const manager = getSharedArchiveManager();
//     vaults.forEach(vault => {
//         const source = manager.unlockedSources.find(source => source.vault.id === vault.id);
//         if (!source) {
//             throw new Error(i18n.t("vault.errors.failed-finding-source", { id: vault.id }));
//         }
//         const newEntries = vault.findEntriesByProperty(ENTRY_URL_REXP, /.+/).filter(entry => {
//             const urlProps = entry.getProperties(ENTRY_URL_REXP);
//             return Object.values(urlProps).some(propURL => {
//                 const domain = extractDomain(propURL);
//                 return (
//                     domain.length > 0 &&
//                     (domain === extractDomain(url) || domain === url) &&
//                     entry.isInTrash() === false
//                 );
//             });
//         });
//         entries.push(
//             ...newEntries.map(entry => ({
//                 entry,
//                 sourceID: source.id
//             }))
//         );
//     });
//     return entries;
// }
