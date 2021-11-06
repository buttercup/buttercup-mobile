import { useCallback, useEffect, useMemo, useState } from "react";
import { Entry, EntryFacade, EntryID, Group, Vault, VaultSourceID, createEntryFacade, GroupID, EntryType } from "buttercup";
import { useBiometricsEnabledForSource } from "./biometrics";
import { getVault, getVaultManager, getVaultSource, sourceHasOfflineCopy } from "../services/buttercup";
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
        updateContents();
        source.on("updated", updateContents);
        return () => {
            source.off("updated", updateContents);
        };
    }, [source, updateContents]);
    return entries;
}

export function useEntryFacade(sourceID: VaultSourceID, entryID: EntryID): EntryFacade {
    const vault = useMemo(() => getVault(sourceID), [sourceID]);
    const entry = useMemo(() => vault.findEntryByID(entryID), [vault]);
    const facade = useMemo(() => entry ? createEntryFacade(entry) : null, [entry]);
    return facade;
}

export function useGroupTitle(sourceID: VaultSourceID, groupID: GroupID): string | null {
    const vault = useMemo(() => getVault(sourceID), [sourceID]);
    const group = useMemo(() => vault.findGroupByID(groupID), [vault]);
    return group && group.getTitle() || null;
}

export function useVaultContents(sourceID: VaultSourceID, targetGroupID: string = null): Array<VaultContentsItem> {
    const source = useMemo(() => getVaultSource(sourceID), [sourceID]);
    const [contents, setContents] = useState<Array<VaultContentsItem>>([]);
    const updateContents = useCallback(() => {
        setContents(extractItems(source.vault, targetGroupID));
    }, [source, targetGroupID]);
    useEffect(() => {
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
    const updateCallback = useCallback(async () => {
        const hasOffline = await sourceHasOfflineCopy(sourceID);
        setOfflineAvailable(hasOffline);
    }, [sourceID]);
    useEffect(() => {
        const vaultManager = getVaultManager();
        vaultManager.on("sourcesUpdated", updateCallback);
        updateCallback();
        return () => {
            vaultManager.off("sourcesUpdated", updateCallback);
        };
    }, [updateCallback, sourceID]);
    return {
        authMethod: sourceUsesBiometrics ? "biometrics" : "password",
        numEntries: 0,
        numGroups: 0,
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
