import React, { Fragment, useCallback, useContext, useState } from "react";
import { Image, SafeAreaView, StyleSheet } from "react-native";
import { VaultSourceID, VaultSourceStatus } from "buttercup";
import { Button, Layout, Text, ViewPager } from "@ui-kitten/components";
import Dots from "react-native-dots-pagination";
import { TextPrompt } from "../prompts/TextPrompt";
import { ConfirmPrompt } from "../prompts/ConfirmPrompt";
import { VaultMenuItem } from "./vault-menu/VaultMenuItem";
import { useVaults } from "../../hooks/buttercup";
import { useBiometricsAvailable, useBiometricsEnabledForSource } from "../../hooks/biometrics";
import { AutofillContext } from "../../contexts/autofill";
import { notifyError, notifyWarning } from "../../library/notifications";
import { unlockSourceByID } from "../../services/buttercup";
import { setBusyState } from "../../services/busyState";
import { setSourcePassword as setSourceAutofillPassword, storeAutofillCredentials } from "../../services/intermediateCredentials";
import { authenticateBiometrics, getBiometricCredentialsForSource } from "../../services/biometrics";
import { VaultDetails } from "../../types";
import { Layerr } from "layerr";

const BCUP_BENCH_IMG = require("../../../resources/images/bcup-bench.png");

export interface VaultMenuProps {
    handleVaultUnlock?: (sourceID: VaultSourceID, password: string) => Promise<void>;
    navigation: any;
    onVaultOpen?: (sourceID: VaultSourceID) => void;
    vaultsOverride?: Array<VaultDetails>;
}

const styles = StyleSheet.create({
    addButton: {
        marginTop: 26
    },
    noVaultContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 22
    },
    noVaultHeading: {
        marginTop: 30
    },
    noVaultText: {
        marginTop: 10,
        paddingHorizontal: 40,
        textAlign: "center",
        width: "100%"
    },
    outerContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "stretch"
    },
    placeholderImage: {
        width: "33%",
        height: 160
    },
    vaultContainer: {
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingBottom: 8
    }
});

function errorPermitsOfflineUse(err: Error) {
    const {
        authFailure,
        status
    } = Layerr.info(err) || {};
    if (authFailure === true || status === 401 || status === 403) {
        return false;
    }
    if (typeof status === "number") {
        return status === 0 || status >= 400;
    }
    return true;
}

async function handleStandardVaultUnlock(sourceID: VaultSourceID, password: string, offlineMode: boolean = false): Promise<void> {
    setBusyState("Unlocking vault");
    await unlockSourceByID(sourceID, password, offlineMode);
    if (!offlineMode) {
        setBusyState("Updating auto-fill");
        setSourceAutofillPassword(sourceID, password);
        await storeAutofillCredentials(sourceID);
    }
    setBusyState(null);
}

export function VaultMenu(props: VaultMenuProps) {
    const {
        handleVaultUnlock = handleStandardVaultUnlock,
        navigation,
        onVaultOpen = null,
        vaultsOverride
    } = props;
    const {
        isAutofill
    } = useContext(AutofillContext);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const vaults: Array<VaultDetails> = useVaults(vaultsOverride);
    const [unlockVaultTarget, setUnlockVaultTarget] = useState<VaultSourceID>(null);
    const [offlineVaultTarget, setOfflineVaultTarget] = useState<{ sourceID: VaultSourceID; password: string; }>(null);
    const biometricsEnabled = useBiometricsAvailable();
    const vaultTargetHasBiometrics = useBiometricsEnabledForSource(vaults.length > 0 && vaults[selectedIndex] ? vaults[selectedIndex].id : null);
    const handlePageSelect = useCallback(index => {
        setSelectedIndex(index);
    }, []);
    const handleAddVaultPress = useCallback(() => {
        navigation.navigate("AddVault");
    }, [navigation]);
    const handleUnlockPromptComplete = useCallback((password: string, vaultTargetOverride: VaultSourceID = null) => {
        const sourceID = vaultTargetOverride || unlockVaultTarget;
        setUnlockVaultTarget(null);
        handleVaultUnlock(sourceID, password)
            .then(() => {
                setSelectedIndex(0);
                onVaultOpen(sourceID);
            })
            .catch(err => {
                notifyError("Failed unlocking vault", err.message);
                setBusyState(null);
                if (errorPermitsOfflineUse(err)) {
                    setOfflineVaultTarget({ sourceID, password });
                    return;
                }
                console.error(err);
                setUnlockVaultTarget(sourceID);
            });
    }, [onVaultOpen, unlockVaultTarget]);
    const handleVaultUnlockOfflinePromptComplete = useCallback(() => {
        const { sourceID, password } = offlineVaultTarget;
        setOfflineVaultTarget(null);
        handleVaultUnlock(sourceID, password, true)
            .then(() => {
                onVaultOpen(sourceID);
                notifyWarning("Read-Only", "Vault was unlocked in read-only mode");
            })
            .catch(err => {
                console.error(err);
                notifyError("Failed unlocking vault", err.message);
                setBusyState(null);
            });
    }, [offlineVaultTarget]);
    const handleVaultPress = useCallback(
        (vault: VaultDetails) => {
            if (vault.state === VaultSourceStatus.Unlocked) {
                onVaultOpen(vault.id);
                return;
            }
            if (!biometricsEnabled || !vaultTargetHasBiometrics) {
                setUnlockVaultTarget(vault.id);
                return;
            }
            authenticateBiometrics()
                .then(succeeded => {
                    if (!succeeded) {
                        setUnlockVaultTarget(vault.id);
                        return;
                    }
                    return getBiometricCredentialsForSource(vault.id).then(password => {
                        handleUnlockPromptComplete(password, vault.id);
                    });
                })
                .catch(err => {
                    console.error(err);
                });
        },
        [biometricsEnabled, handleUnlockPromptComplete, onVaultOpen, vaultTargetHasBiometrics]
    );
    return (
        <SafeAreaView style={styles.outerContainer}>
            {vaults.length > 0 && (
                <Layout level="2" style={styles.vaultContainer}>
                    <ViewPager selectedIndex={selectedIndex} onSelect={handlePageSelect}>
                        {vaults.map(vault => (
                            <Fragment key={vault.id}>
                                <VaultMenuItem
                                    onActivate={() => handleVaultPress(vault)}
                                    vault={vault}
                                />
                            </Fragment>
                        ))}
                    </ViewPager>
                    <Dots length={vaults.length} active={selectedIndex} />
                </Layout>
            )}
            {vaults.length === 0 && (
                <Layout style={styles.noVaultContainer}>
                    <Image
                        resizeMode="contain"
                        source={BCUP_BENCH_IMG}
                        style={styles.placeholderImage}
                    />
                    <Text category="h4" style={styles.noVaultHeading}>No Vaults</Text>
                    <Text category="p1" style={styles.noVaultText}>
                        {isAutofill
                            ? "There aren't any vaults here. Enable auto-fill on a vault to access it here."
                            : "There aren't any vaults here yet. Why not add one?"
                        }
                    </Text>
                    {!isAutofill && (
                        <Button onPress={handleAddVaultPress} style={styles.addButton}>Add Vault</Button>
                    )}
                </Layout>
            )}
            <TextPrompt
                cancelable
                onCancel={() => setUnlockVaultTarget(null)}
                onSubmit={handleUnlockPromptComplete}
                password
                prompt="Vault password"
                submitText="Unlock"
                visible={!!unlockVaultTarget}
            />
            <ConfirmPrompt
                cancelable
                confirmText="Unlock Read-Only"
                onCancel={() => setOfflineVaultTarget(null)}
                onConfirm={handleVaultUnlockOfflinePromptComplete}
                prompt="Unlock in offline, read-only mode?"
                title="Vault Unavailable"
                visible={!!offlineVaultTarget}
            />
        </SafeAreaView>
    );
}
