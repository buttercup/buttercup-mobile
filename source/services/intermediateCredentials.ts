import { Platform } from "react-native";
import { EntryType, EntryURLType, VaultSource, VaultSourceID, getEntryURLs, VaultSourceStatus } from "buttercup";
import SecureStorage, { ACCESSIBLE, AUTHENTICATION_TYPE } from "react-native-secure-storage";
import { getAdapter } from "./appEnv";
import { getVaultSource } from "./buttercup";
import { getVaultConfig } from "./config";
import { AutoFillBridge } from "./autofillBridge";
import { IntermediateEntry, IntermediateVault, StoredAutofillEntries, VaultDetails } from "../types";
import { notifyError } from "../library/notifications";

const AUTOFILLABLE_ENTRY_TYPES = [EntryType.Login, EntryType.Website];
const INTERMEDIATE_ENCRYPTION_ROUNDS = 10000;
const STORAGE_SERVICE = Platform.select({
    ios: "pw.buttercup.mobile",
    android: "com.buttercup"
});
const SECURE_STORAGE_CONFIG = {
    accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    authenticationPrompt: "Authenticate to access auto-fill vaults",
    service: STORAGE_SERVICE,
    authenticateType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
    accessGroup: "group.pw.buttercup.mobile" // So that the Keychain is available in the AutoFill Extension
};
const SOURCE_STORAGE_KEY = "@@autofillSources";

let __sourcePasswords: Record<VaultSourceID, string> = {};

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
    const sourcesRaw: string = await SecureStorage.getItem(SOURCE_STORAGE_KEY, SECURE_STORAGE_CONFIG);
    const sources: Array<IntermediateVault> = sourcesRaw ? JSON.parse(sourcesRaw) : [];
    return sources;
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

export async function removeCredentialsForVault(sourceID: VaultSourceID): Promise<void> {
    if (!AutoFillBridge.DEVICE_SUPPORTS_AUTOFILL) {
        return;
    }
    await AutoFillBridge.removeEntriesForSourceID(sourceID);
}

export function setSourcePassword(sourceID: VaultSourceID, password: string) {
    __sourcePasswords[sourceID] = password;
}

export async function storeAutofillCredentials(sourceID: VaultSourceID, override: boolean = false): Promise<void> {
    const vaultConfig = getVaultConfig(sourceID);
    if (vaultConfig.autofill || override) {
        const source = getVaultSource(sourceID);
        await storeCredentialsForVault(source);
    }
}

async function storeCredentialsForVault(source: VaultSource): Promise<void> {
    if (!AutoFillBridge.DEVICE_SUPPORTS_AUTOFILL) {
        // No need to do any of this stuff if the user's device doesn't support Autofill (e.g. old version of Android).
        return;
    }
    if (!__sourcePasswords[source.id]) {
        notifyError("Autofill store failure", "Not initialised correctly for this vault");
        return;
    }

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
    // Write to native
    await AutoFillBridge.updateEntriesForSourceID(source.id, autofillEntries);
    // Prepare encryption test
    const iocaneAdapter = getAdapter();
    iocaneAdapter.setDerivationRounds(INTERMEDIATE_ENCRYPTION_ROUNDS);
    const authToken = await iocaneAdapter.encrypt(source.id, __sourcePasswords[source.id]) as string;
    // Store vault
    const sourcesRaw: string = await SecureStorage.getItem(SOURCE_STORAGE_KEY, SECURE_STORAGE_CONFIG);
    const sources: Array<IntermediateVault> = sourcesRaw ? JSON.parse(sourcesRaw) : [];
    const existingSourceInd = sources.findIndex(src => src.id === source.id);
    if (existingSourceInd >= 0) {
        // Replace existing source if it exists
        sources.splice(existingSourceInd, 1);
    }
    sources.unshift({
        id: source.id,
        name: source.name,
        type: source.type,
        authToken
    });
    await SecureStorage.setItem(SOURCE_STORAGE_KEY, JSON.stringify(sources), SECURE_STORAGE_CONFIG);
}
