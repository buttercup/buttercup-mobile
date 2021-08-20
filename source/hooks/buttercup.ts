import { useCallback, useEffect, useMemo, useState } from "react";
import { Entry, EntryFacade, EntryID, Group, Vault, VaultSourceID, createEntryFacade } from "buttercup";
import { getVault, getVaultManager } from "../services/buttercup";
import { VaultContentsItem, VaultDetails } from "../types";

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
        ...groups.map(group => ({
            id: group.id,
            title: group.getTitle(),
            type: "group" as const
        })),
        ...entries.map(entry => ({
            id: entry.id,
            title: entry.getProperty("title") as string,
            type: "entry" as const
        }))
    ];
}

export function useEntryFacade(sourceID: VaultSourceID, entryID: EntryID): EntryFacade {
    const vault = useMemo(() => getVault(sourceID), [sourceID]);
    const entry = useMemo(() => vault.findEntryByID(entryID), [vault]);
    const facade = useMemo(() => entry ? createEntryFacade(entry) : null, [entry]);
    return facade;
}

export function useVaultContents(sourceID: VaultSourceID, targetGroupID: string = null): Array<VaultContentsItem> {
    const vault = useMemo(() => getVault(sourceID), [sourceID]);
    const contents = useMemo(() => extractItems(vault, targetGroupID), [targetGroupID, vault]);
    return contents;
}

export function useVaults(): Array<VaultDetails> {
    const vaultManager = useMemo(getVaultManager, []);
    const [vaults, setVaults] = useState<Array<VaultDetails>>([]);
    const updateCallback = useCallback(() => {
        setVaults(vaultManager.sources.map(source => ({
            id: source.id,
            name: source.name,
            state: source.status,
            order: source.order,
            type: source.type
        })));
    }, [vaultManager]);
    useEffect(() => {
        vaultManager.on("sourcesUpdated", updateCallback);
        updateCallback();
        return () => {
            vaultManager.off("sourcesUpdated", updateCallback);
        };
    }, [vaultManager]);
    return vaults;
}
