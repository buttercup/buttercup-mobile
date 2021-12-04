import { VaultSourceID } from "buttercup";
import ms from "ms";
import EventEmitter from "eventemitter3";
import { getAsyncStorage } from "./storage";
import { getAllSourceIDs, onVaultSourcesUpdated } from "./buttercup";
import { cloneObject } from "../library/clone";

export interface VaultConfiguration {
    autoLockEnabled: boolean;
    autoLockTime: number;
}

const STORAGE_PREFIX_VAULT_CONFIG = "config:source:";

const __vaultConfigurations: Record<VaultSourceID, VaultConfiguration> = {};
let __emitter: EventEmitter = null;

export function getEmitter(): EventEmitter {
    if (!__emitter) {
        __emitter = new EventEmitter();
    }
    return __emitter;
}

function getInitialConfig(): VaultConfiguration {
    return {
        autoLockEnabled: true,
        autoLockTime: ms("15m")
    };
}

export function getVaultConfig(sourceID: VaultSourceID): VaultConfiguration {
    return __vaultConfigurations[sourceID] ?? null;
}

export async function initialise(): Promise<void> {
    const storage = getAsyncStorage();
    const allKeys = await storage.getAllKeys();
    const configKeys = allKeys.filter(key => key.indexOf(STORAGE_PREFIX_VAULT_CONFIG) === 0);
    let currentSources = getAllSourceIDs();
    // Remove old keys
    const oldKeys = configKeys.filter(key => {
        const sourceID = key.replace(STORAGE_PREFIX_VAULT_CONFIG, "");
        return currentSources.indexOf(sourceID) === -1;
    });
    for (const oldKey of oldKeys) {
        await storage.removeKey(oldKey);
    }
    const updateFromVaultSources = async () => {
        // Prepare current source configurations
        for (const sourceID of currentSources) {
            const storageKey = `${STORAGE_PREFIX_VAULT_CONFIG}${sourceID}`;
            const hasConfig = configKeys.includes(storageKey);
            if (hasConfig) {
                const rawConfig = await storage.getValue(storageKey);
                __vaultConfigurations[sourceID] = mergeConfigurations(
                    getInitialConfig(),
                    JSON.parse(rawConfig)
                );
            } else {
                // No config, yet
                const config = __vaultConfigurations[sourceID] = getInitialConfig();
                // Write back
                await storage.setValue(storageKey, JSON.stringify(config));
            }
        }
    };
    await updateFromVaultSources();
    // Listen for further updates
    onVaultSourcesUpdated(async () => {
        currentSources = getAllSourceIDs();
        await updateFromVaultSources();
    });
}

function mergeConfigurations(target: VaultConfiguration, merge: VaultConfiguration): VaultConfiguration {
    const output = cloneObject(target);
    for (const key in merge) {
        output[key] = merge[key];
    }
    return output;
}

export async function updateVaultConfig(sourceID: VaultSourceID, config: VaultConfiguration): Promise<void> {
    const storage = getAsyncStorage();
    const updatedConfig = __vaultConfigurations[sourceID] = mergeConfigurations(getInitialConfig(), config);
    const storageKey = `${STORAGE_PREFIX_VAULT_CONFIG}${sourceID}`;
    await storage.setValue(storageKey, JSON.stringify(updatedConfig));
    getEmitter().emit(`update:${sourceID}`, updatedConfig);
}
