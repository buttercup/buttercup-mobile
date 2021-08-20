import { EntryID, EntryType, EntryURLType, Vault, VaultSourceID, getEntryURLs } from "buttercup";
import { encryptData, setDerivationRounds } from "./appEnv";
import { getAsyncStorage } from "./storage";

interface IntermediateEntry {
    id: EntryID;
    title: string;
    username: string;
    password: string;
    urls: Array<string>;
}

const AUTOFILLABLE_ENTRY_TYPES = [EntryType.Login, EntryType.Website];
const INTERMEDIATE_ENCRYPTION_ROUNDS = 10000;
const STORAGE_PREFIX = "intermediate:autofill:";

export async function storeCredentialsForVault(sourceID: VaultSourceID, vault: Vault, password: string): Promise<void> {
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
    // Store
    const storage = getAsyncStorage();
    await storage.setValue(`${STORAGE_PREFIX}${sourceID}`, encryptedPayload);
}
