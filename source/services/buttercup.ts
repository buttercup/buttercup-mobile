import path from "path-browserify";
import {
    Credentials,
    EntryFacade,
    EntryID,
    GroupID,
    Vault,
    VaultManager,
    VaultSource,
    VaultSourceID,
    VaultSourceStatus,
    consumeEntryFacade,
    createEntryFacade,
    createEntryFromFacade
} from "buttercup";
import { initAppEnv } from "./appEnv";
import { setBusyState } from "../services/busyState";
import { getAsyncStorage } from "../services/storage";
import { notifyError } from "../library/notifications";
import { DatasourceConfig, VaultChooserItem, VaultDetails } from "../types";

const __watchedVaultSources: Array<VaultSourceID> = [];
let __mgr: VaultManager = null;

export async function addVault(type: string, config: DatasourceConfig, vaultPath: VaultChooserItem, password: string): Promise<VaultSourceID> {
    if (type === "webdav") return addWebDAVVault(config, vaultPath, password);
    throw new Error(`Unknown vault type: ${type}`);
}

async function addWebDAVVault(config: DatasourceConfig, vaultPath: VaultChooserItem, password: string): Promise<VaultSourceID> {
    const isNew = !vaultPath.identifier;
    const filename = vaultPath.identifier || vaultPath.name;
    const filePath = vaultPath.parent
        ? path.join(vaultPath.parent.identifier, filename)
        : path.join("/", filename);
    const sourceCredentials = Credentials.fromDatasource({
        ...config,
        path: filePath
    }, password);
    const sourceCredentialsRaw = await sourceCredentials.toSecureString();
    const vaultMgr = getVaultManager();
    const source = new VaultSource(filename, config.type, sourceCredentialsRaw);
    await vaultMgr.addSource(source);
    setBusyState("Unlocking Vault");
    await source.unlock(
        Credentials.fromPassword(password),
        {
            initialiseRemote: isNew
        }
    );
    return source.id;
}

async function attachVaultManagerWatchers() {
    const vaultManager = getVaultManager();
    vaultManager.on("autoUpdateFailed", ({ source, error }: { source: VaultDetails, error: Error }) => {
        console.error(`Auto update failed for source: ${source.id}`, error);
        notifyError("Auto update failed", `Update failed for source: ${source.name}`);
    });
    vaultManager.on("sourcesUpdated", async () => {
        vaultManager.unlockedSources.forEach((source) => {
            if (!__watchedVaultSources.includes(source.id)) {
                source.on("updated", () => onVaultSourceUpdated(source));
                __watchedVaultSources.push(source.id);
            }
        });
        // await updateSearchCaches(vaultManager.unlockedSources);
    });
}

export async function createNewGroup(sourceID: VaultSourceID, groupName: string, parentGroupID: GroupID = null): Promise<GroupID> {
    const source = getVaultManager().getSourceForID(sourceID);
    let newGroupID: GroupID;
    if (parentGroupID) {
        const parentGroup = source.vault.findGroupByID(parentGroupID);
        if (!parentGroup) {
            throw new Error(`No group found for ID: ${parentGroup}`);
        }
        newGroupID = parentGroup.createGroup(groupName).id;
    } else {
        newGroupID = source.vault.createGroup(groupName).id;
    }
    await source.save();
    return newGroupID;
}

export async function deleteGroup(sourceID: VaultSourceID, groupID: GroupID): Promise<void> {
    const source = getVaultManager().getSourceForID(sourceID);
    const group = source.vault.findGroupByID(groupID);
    if (!groupID) {
        throw new Error(`No group found for ID: ${groupID}`);
    }
    group.delete();
    await source.save();
}

export function getEntryFacade(sourceID: VaultSourceID, entryID: EntryID): EntryFacade {
    const { vault } = getVaultManager().getSourceForID(sourceID);
    const entry = vault.findEntryByID(entryID);
    return createEntryFacade(entry);
}

export function getVault(sourceID: VaultSourceID): Vault {
    return getVaultSource(sourceID).vault;
}

export function getVaultManager(): VaultManager {
    if (!__mgr) {
        const storage = getAsyncStorage();
        __mgr = new VaultManager({
            autoUpdate: true,
            cacheStorage: storage,
            sourceStorage: storage
        });
    }
    return __mgr;
}

export function getVaultSource(sourceID: VaultSourceID): VaultSource {
    return getVaultManager().getSourceForID(sourceID);
}

export async function initialise() {
    initAppEnv();
    await attachVaultManagerWatchers();
    await getVaultManager().rehydrate();
}

function onVaultSourceUpdated(source: VaultSource) {
    // clearFacadeCache(source.id);
    // notifyWindowsOfSourceUpdate(source.id);
}

export async function saveExistingEntryChanges(sourceID: VaultSourceID, entryID: EntryID, facade: EntryFacade): Promise<void> {
    const vaultMgr =  getVaultManager();
    const source = vaultMgr.getSourceForID(sourceID);
    const entry = source.vault.findEntryByID(entryID);
    if (!entry) {
        throw new Error(`No entry found for ID: ${entryID}`);
    }
    consumeEntryFacade(entry, facade);
    await source.save();
}

export async function saveNewEntry(sourceID: VaultSourceID, groupID: GroupID, facade: EntryFacade): Promise<EntryID> {
    const vaultMgr =  getVaultManager();
    const source = vaultMgr.getSourceForID(sourceID);
    const group = source.vault.findGroupByID(groupID);
    if (!group) {
        throw new Error(`No group found for ID: ${groupID}`);
    }
    const entry = createEntryFromFacade(group, facade);
    await source.save();
    return entry.id;
}

export async function unlockSourceByID(sourceID: VaultSourceID, password: string): Promise<void> {
    const vaultMgr =  getVaultManager();
    const source = vaultMgr.getSourceForID(sourceID);
    if (source.status !== VaultSourceStatus.Locked) {
        throw new Error(`Cannot unlock vault: Vault in invalid state: ${source.status}`);
    }
    await source.unlock(Credentials.fromPassword(password));
}

export async function verifySourcePassword(sourceID: VaultSourceID, password: string): Promise<boolean> {
    const vaultMgr =  getVaultManager();
    const source = vaultMgr.getSourceForID(sourceID);
    return source.testMasterPassword(password);
}
