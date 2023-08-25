import { VaultSourceID } from "buttercup";
import { getAllSourceIDs, lockVault, onVaultSourcesUpdated } from "./buttercup";
import { registerActivityCallback } from "./activity";
import { getEmitter as getConfigEmitter, getVaultConfig } from "./config";
import { VAULT } from "../state/vault";
import { navigateBackToRoot } from "../state/navigation";

let __listeners: Record<VaultSourceID, (inactivity: number) => Promise<void>> = {};

export function initialise() {
    onVaultSourcesUpdated(() => {
        updateVaultConfigurations();
    });
    registerActivityCallback((inactivity: number) => {
        for (const sourceID in __listeners) {
            __listeners[sourceID](inactivity).catch(err => {
                console.error(err);
            });
        }
    });
    const configEmitter = getConfigEmitter();
    configEmitter.on("update", (sourceID: VaultSourceID) => {
        updateListenerForSource(sourceID);
    });
    updateVaultConfigurations();
}

function updateVaultConfigurations() {
    const sourceIDs = getAllSourceIDs();
    for (const sourceID of sourceIDs) {
        updateListenerForSource(sourceID);
    }
}

function updateListenerForSource(sourceID: VaultSourceID) {
    const config = getVaultConfig(sourceID);
    if (config?.autoLockEnabled) {
        __listeners[sourceID] = async (inactivity: number) => {
            if (inactivity >= config.autoLockTime) {
                if (VAULT.currentSource === sourceID) {
                    // Navigate back out
                    navigateBackToRoot();
                }
                // Lock vault
                await lockVault(sourceID);
            }
        };
    } else {
        delete __listeners[sourceID];
    }
}
