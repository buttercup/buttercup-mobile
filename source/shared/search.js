import { Search } from "../library/buttercupCore.js";
import MobileStorageInterface from "../compat/MobileStorageInterface.js";
import { getSharedArchiveManager } from "../library/buttercup.js";

let __search = null,
    __prepPromise = null;

async function getSearch() {
    if (__prepPromise) {
        await __prepPromise;
    }
    return __search;
}

function getSourceForVaultID(vaultID, vaultManager = getSharedArchiveManager()) {
    const source = vaultManager.unlockedSources.find(source => source.vault.id === vaultID);
    return source || null;
}

function search(key, method) {
    const sources = {};
    const vaultManager = getSharedArchiveManager();
    return getSearch()
        .then(search => search[method](key))
        .then(results =>
            results.map(result => {
                const source =
                    sources[result.vaultID] ||
                    (sources[result.vaultID] = getSourceForVaultID(result.vaultID, vaultManager));
                const entry = source.vault.findEntryByID(result.id);
                return {
                    sourceID: source.id,
                    groupID: entry.getGroup().id,
                    entry
                };
            })
        );
}

export async function searchUsingTerm(term) {
    return search(term, "searchByTerm");
}

export async function searchUsingURL(url) {
    return search(url, "searchByURL");
}

export async function updateSearch(vaults) {
    if (__prepPromise) {
        await __prepPromise;
        __prepPromise = null;
    }
    const storage = new MobileStorageInterface();
    __search = new Search(vaults, storage);
    __prepPromise = __search.prepare();
}
