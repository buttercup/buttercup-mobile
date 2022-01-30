import { useCallback, useEffect, useMemo, useState } from "react";
import { Entry, EntryFacade, EntryID, Group, Vault, VaultSourceID, createEntryFacade, GroupID, EntryType } from "buttercup";
import { useBiometricsEnabledForSource } from "./biometrics";
import { getVault, getVaultManager, getVaultSource, sourceHasOfflineCopy } from "../services/buttercup";
import { getEmitter as getStatisticsEmitter, getSourceItemsCount } from "../services/statistics";
import { VaultContentsItem, VaultDetails } from "../types";

interface VaultStatistics {
    authMethod: "password" | "biometrics";
    numEntries: number;
    numGroups: number;
    offlineAvailable: boolean;
}

function extractItems(vault: Vault, targetGroupID: string = null): Array<VaultContentsItem> {
    let groups: Array<Group> = [],
        entries: Array<Entry> = [];
    if (targetGroupID) {
        const group = vault.findGroupByID(targetGroupID);
        if (!group) return [];
        groups = group.getGroups();
        entries = group.getEntries();
    } else {
        groups = vault.getGroups();
    }
    return [
        ...groups.map((group: Group): VaultContentsItem => ({
            id: group.id,
            title: group.getTitle(),
            type: "group" as const,
            isTrash: group.isTrash()
        })),
        ...entries.map((entry: Entry): VaultContentsItem => ({
            id: entry.id,
            title: entry.getProperty("title") as string,
            type: "entry" as const,
            entryType: entry.getType(),
            entryProperties: entry.getProperties(),
            isTrash: false
        }))
    ];
}

function sortItems(items: Array<VaultContentsItem>): Array<VaultContentsItem> {
    return items.sort((a, b) => {
        if (a.isTrash) return 1;
        if (b.isTrash) return -1;
        if (a.type === "group" && b.type === "entry") return -1;
        if (b.type === "group" && a.type === "entry") return 1;
        if (a.title > b.title) return 1;
        if (b.title > a.title) return -1;
        return 0;
    });
}

export function useEntries(sourceID: VaultSourceID): Array<Entry> {
    const source = useMemo(() => getVaultSource(sourceID), [sourceID]);
    const [entries, setEntries] = useState<Array<Entry>>([]);
    const updateContents = useCallback(() => {
        setEntries(source.vault.getAllEntries());
    }, [source]);
    useEffect(() => {
        if (!source) return;
        updateContents();
        source.on("updated", updateContents);
        return () => {
            source.off("updated", updateContents);
        };
    }, [source, updateContents]);
    return entries;
}

export function useEntryFacade(sourceID: VaultSourceID, entryID: EntryID): EntryFacade {
    const source = useMemo(() => getVaultSource(sourceID), [sourceID]);
    const [entryFacade, setEntryFacade] = useState<EntryFacade>(null);
    const updateFacade = useCallback((vault: Vault) => {
        const entry = vault.findEntryByID(entryID);
        if (entry) {
            setEntryFacade(createEntryFacade(entry));
        }
    }, [entryID]);
    useEffect(() => {
        const cb = () => updateFacade(source.vault);
        if (source.vault) cb();
        source.on("updated", cb);
        return () => {
            source.off("updated", cb);
        };
    }, [updateFacade, source]);
    return entryFacade;
}

export function useGroupTitle(sourceID: VaultSourceID, groupID: GroupID): string | null {
    const vault = useMemo(() => sourceID ? getVault(sourceID) : null, [sourceID]);
    const group = useMemo(() => vault?.findGroupByID(groupID) ?? null, [vault]);
    return group?.getTitle() ?? null;
}

export function useVaultContents(sourceID: VaultSourceID, targetGroupID: string = null): Array<VaultContentsItem> {
    const source = useMemo(() => getVaultSource(sourceID), [sourceID]);
    const [contents, setContents] = useState<Array<VaultContentsItem>>([]);
    const updateContents = useCallback(() => {
        if (!source?.vault) return;
        setContents(sortItems(extractItems(source.vault, targetGroupID)));
    }, [source, targetGroupID]);
    useEffect(() => {
        if (!source) return;
        updateContents();
        source.on("updated", updateContents);
        return () => {
            source.off("updated", updateContents);
        };
    }, [source, updateContents]);
    return contents;
}

export function useVaultStatistics(sourceID: VaultSourceID): VaultStatistics {
    const sourceUsesBiometrics = useBiometricsEnabledForSource(sourceID);
    const [offlineAvailable, setOfflineAvailable] = useState<boolean>(false);
    const [numEntries, setNumEntries] = useState<number>(0);
    const [numGroups, setNumGroups] = useState<number>(0);
    const statisticsEmitter = useMemo(getStatisticsEmitter, []);
    const updateCallback = useCallback(async () => {
        const [hasOffline, itemsCount] = await Promise.all([
            sourceHasOfflineCopy(sourceID),
            getSourceItemsCount(sourceID)
        ]);
        setOfflineAvailable(hasOffline);
        setNumEntries(itemsCount.entries);
        setNumGroups(itemsCount.groups);
    }, [sourceID]);
    useEffect(() => {
        const vaultManager = getVaultManager();
        vaultManager.on("sourcesUpdated", updateCallback);
        statisticsEmitter.on(`updated:${sourceID}`, updateCallback);
        updateCallback();
        return () => {
            vaultManager.off("sourcesUpdated", updateCallback);
            statisticsEmitter.off(`updated:${sourceID}`, updateCallback);
        };
    }, [sourceID, statisticsEmitter, updateCallback]);
    return {
        authMethod: sourceUsesBiometrics ? "biometrics" : "password",
        numEntries,
        numGroups,
        offlineAvailable
    };
}

export function useVaultWalletEntries(sourceID: VaultSourceID): Array<Entry> {
    const entries = useEntries(sourceID);
    const walletEntries = useMemo(() => entries.filter(entry =>
        [EntryType.CreditCard].includes(entry.getType())
    ), [entries]);
    return walletEntries;
}

export function useVaults(vaultsOveride?: Array<VaultDetails>): Array<VaultDetails> {
    const [vaults, setVaults] = useState<Array<VaultDetails>>([]);
    const updateCallback = useCallback(() => {
        if (Array.isArray(vaultsOveride)) return;
        const vaultManager = getVaultManager();
        setVaults(vaultManager.sources.map(source => ({
            id: source.id,
            name: source.name,
            state: source.status,
            order: source.order,
            readOnly: !!source?.vault?.format.readOnly,
            type: source.type
        })));
    }, [vaultsOveride]);
    useEffect(() => {
        if (Array.isArray(vaultsOveride)) {
            setVaults(vaultsOveride);
            return;
        }
        const vaultManager = getVaultManager();
        vaultManager.on("sourcesUpdated", updateCallback);
        updateCallback();
        return () => {
            vaultManager.off("sourcesUpdated", updateCallback);
        };
    }, [vaultsOveride]);
    return vaults;
}
