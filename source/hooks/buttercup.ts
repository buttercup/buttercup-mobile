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
            type: "group" as const
        })),
        ...entries.map((entry: Entry): VaultContentsItem => ({
            id: entry.id,
            title: entry.getProperty("title") as string,
            type: "entry" as const,
            entryType: entry.getType(),
            entryProperties: entry.getProperties()
        }))
    ];
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
    const vault = useMemo(() => sourceID ? getVault(sourceID) : null, [sourceID]);
    const entry = useMemo(() => vault?.findEntryByID(entryID) ?? null, [vault]);
    return useMemo(() => entry ? createEntryFacade(entry) : null, [entry]);
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
        setContents(extractItems(source.vault, targetGroupID));
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
