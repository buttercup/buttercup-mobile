import { EntryType, EntryURLType, VaultSource, VaultSourceID, getEntryURLs, VaultSourceStatus, getEntryPath, EntryID } from "buttercup";
import { getAdapter } from "./appEnv";
import { getSharedStorage } from "./storage";
import { AutoFillBridge } from "./autofillBridge";
import { IntermediateEntry, IntermediateVault, StoredAutofillEntries, VaultDetails } from "../types";

const AUTOFILLABLE_ENTRY_TYPES = [EntryType.Login, EntryType.Website];
const INTERMEDIATE_ENCRYPTION_ROUNDS = 10000;
const STORAGE_PREFIX_SOURCES = "intermediate:autofill:sources";

export async function getCredentialsForVault(sourceID: VaultSourceID, password: string): Promise<Array<IntermediateEntry>> {
    const vaults = await getStoredIntermediateVaults();
    const vault = vaults.find(v => v.id === sourceID);
    if (!vault) {
        throw new Error(`No autofill vault found: ${sourceID}`);
    }
    const iocaneAdapter = getAdapter();
    const decryptedAuth = await iocaneAdapter.decrypt(vault.authToken, password) as string;
    if (decryptedAuth !== vault.id) {
        throw new Error(`Failed authenticating encrypted autofill vault`);
    }
    const entries = await AutoFillBridge.getEntriesForSourceID(sourceID);
    return Object.values(entries);
}

async function getStoredIntermediateVaults(): Promise<Array<IntermediateVault>> {
    const storage = getSharedStorage();
    const vaults = await storage.getItem(STORAGE_PREFIX_SOURCES);
    return Array.isArray(vaults) ? vaults : [];
}

export async function getStoredVaults(): Promise<Array<VaultDetails>> {
    const sources = await getStoredIntermediateVaults();
    return (sources || []).map((vault, index) => intermediateVaultToDetails(vault, index));
}

function intermediateVaultToDetails(vault: IntermediateVault, index: number): VaultDetails {
    return {
        id: vault.id,
        name: vault.name,
        state: VaultSourceStatus.Locked,
        order: index,
        type: vault.type
    };
}

export async function storeCredentialsForVault(source: VaultSource, password: string): Promise<void> {
    const { vault } = source;
    // Get all entries that are either Logins or Websites
    const entries = vault.getAllEntries().filter(entry => AUTOFILLABLE_ENTRY_TYPES.includes(entry.getType()));
    // Update autofill entries
    const autofillEntries: StoredAutofillEntries = entries.reduce((output, entry) => {
        const urls = getEntryURLs(entry.getProperties(), EntryURLType.General);
        return {
            ...output,
            [entry.id]: {
                id: entry.id,
                entryPath: source.name,
                title: entry.getProperty("title") as string || "(Untitled entry)",
                username: entry.getProperty("username") as string || "",
                password: entry.getProperty("password") as string || "",
                urls
            }
        };
    }, {});
    await AutoFillBridge.updateEntriesForSourceID(source.id, autofillEntries);
    // Prepare encryption test
    const iocaneAdapter = getAdapter();
    iocaneAdapter.setDerivationRounds(INTERMEDIATE_ENCRYPTION_ROUNDS);
    const authToken = await iocaneAdapter.encrypt(source.id, password) as string;
    // Store vault
    const storage = getSharedStorage();
    let sources: Array<IntermediateVault> = await storage.getItem(STORAGE_PREFIX_SOURCES);
    if (!sources) {
        sources = [];
    }
    const existingSourceInd = sources.findIndex(src => src.id === source.id);
    if (existingSourceInd >= 0) {
        sources.splice(existingSourceInd, 1);
    }
    sources.unshift({
        id: source.id,
        name: source.name,
        type: source.type,
        authToken
    });
    await storage.setItem(STORAGE_PREFIX_SOURCES, sources);
}
