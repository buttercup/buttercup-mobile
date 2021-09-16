import { EntryType, EntryURLType, VaultSource, VaultSourceID, getEntryURLs, VaultSourceStatus } from "buttercup";
import { decryptData, encryptData, setDerivationRounds } from "./appEnv";
import { getSharedStorage } from "./storage";
import { IntermediateEntry, IntermediateVault, VaultDetails } from "../types";

const AUTOFILLABLE_ENTRY_TYPES = [EntryType.Login, EntryType.Website];
const INTERMEDIATE_ENCRYPTION_ROUNDS = 10000;
const STORAGE_PREFIX_ENTRIES = "intermediate:autofill:entries:";
const STORAGE_PREFIX_SOURCES = "intermediate:autofill:sources";

export async function getCredentialsForVault(sourceID: VaultSourceID, password: string): Promise<Array<IntermediateEntry>> {
    const storage = getSharedStorage();
    const encryptedPayload = await storage.getItem(`${STORAGE_PREFIX_ENTRIES}${sourceID}`);
    const decrypted = await decryptData(encryptedPayload, password) as string;
    const items: Array<IntermediateEntry> = JSON.parse(decrypted);
    return items;
}

export async function getStoredVaults(): Promise<Array<VaultDetails>> {
    const storage = getSharedStorage();
    const sources: Array<IntermediateVault> = await storage.getItem(STORAGE_PREFIX_SOURCES);
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
    // Encode
    const items: Array<IntermediateEntry> = entries.reduce((output, entry) => {
        const urls = getEntryURLs(entry.getProperties(), EntryURLType.Any);
        if (urls.length === 0) return output;
        return [
            ...output,
            {
                id: entry.id,
                title: entry.getProperty("title") || "(Untitled entry)",
                username: entry.getProperty("username") || "",
                password: entry.getProperty("password") || "",
                urls
            }
        ];
    }, []);
    // Encrypt
    setDerivationRounds(INTERMEDIATE_ENCRYPTION_ROUNDS);
    const encryptedPayload = await encryptData(JSON.stringify(items), password) as string;
    // Store entries
    const storage = getSharedStorage();
    await storage.setItem(`${STORAGE_PREFIX_ENTRIES}${source.id}`, encryptedPayload);
    // Store vault
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
        type: source.type
    });
    await storage.setItem(STORAGE_PREFIX_SOURCES, sources);
}
