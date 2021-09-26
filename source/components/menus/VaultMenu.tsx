import React, { useCallback, useState } from "react";
import { Image, SafeAreaView, StyleSheet, View } from "react-native";
import { VaultSourceID, VaultSourceStatus } from "buttercup";
import { Button, Card, Layout, Text, ViewPager } from "@ui-kitten/components";
import Dots from "react-native-dots-pagination";
import { TextPrompt } from "../prompts/TextPrompt";
import { useVaults } from "../../hooks/buttercup";
import { useBiometricsAvailable, useBiometricsEnabledForSource } from "../../hooks/biometrics";
import { notifyError } from "../../library/notifications";
import { getVaultSource, unlockSourceByID } from "../../services/buttercup";
import { setBusyState } from "../../services/busyState";
import { storeCredentialsForVault } from "../../services/intermediateCredentials";
import { authenticateBiometrics, getBiometricCredentialsForSource } from "../../services/biometrics";
import { VaultDetails } from "../../types";

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
    card: {
        margin: 16
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
    tumbleweed: {
        width: "33%",
        height: 160
    }
});

async function handleStandardVaultUnlock(sourceID: VaultSourceID, password: string): Promise<void> {
    setBusyState("Unlocking vault");
    await unlockSourceByID(sourceID, password);
    setBusyState("Updating auto-fill");
    const source = getVaultSource(sourceID);
    await storeCredentialsForVault(source, password);
    setBusyState(null);
}

function VaultCardFooter(props) {
    const { vault } = props;
    return (
        <View>
            <Text category="s2">{vault.state.toUpperCase()}</Text>
        </View>
    );
}

function VaultCardHeader(props) {
    const { vault } = props;
    return (
        <View>
            <Text category="h4">{vault.name}</Text>
        </View>
    );
}

export function VaultMenu(props: VaultMenuProps) {
    const {
        handleVaultUnlock = handleStandardVaultUnlock,
        navigation,
        onVaultOpen = null,
        vaultsOverride
    } = props;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const vaults: Array<VaultDetails> = useVaults(vaultsOverride);
    const [unlockVaultTarget, setUnlockVaultTarget] = useState<VaultSourceID>(null);
    const biometricsEnabled = useBiometricsAvailable();
    const vaultTargetHasBiometrics = useBiometricsEnabledForSource(vaults.length > 0 ? vaults[selectedIndex].id : null);
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
                onVaultOpen(sourceID);
            })
            .catch(err => {
                console.error(err);
                notifyError("Failed unlocking vault", err.message);
                setBusyState(null);
                setUnlockVaultTarget(sourceID);
            });
    }, [onVaultOpen, unlockVaultTarget]);
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
        <SafeAreaView style={{ flex: 1 }}>
            {vaults.length > 0 && (
                <>
                    <ViewPager selectedIndex={selectedIndex} onSelect={handlePageSelect}>
                        {vaults.map(vault => (
                            <Layout key={vault.id} level="2">
                                <Card
                                    footer={props => <VaultCardFooter {...props} vault={vault} />}
                                    header={props => <VaultCardHeader {...props} vault={vault} />}
                                    onPress={() => handleVaultPress(vault)}
                                    style={styles.card}
                                >
                                    <Text>Some Vault</Text>
                                </Card>
                            </Layout>
                        ))}
                    </ViewPager>
                    <Dots length={vaults.length} active={selectedIndex} />
                </>
            )}
            {vaults.length === 0 && (
                <Layout style={styles.noVaultContainer}>
                    <Image
                        resizeMode="contain"
                        source={BCUP_BENCH_IMG}
                        style={styles.tumbleweed}
                    />
                    <Text category="h4" style={styles.noVaultHeading}>No Vaults</Text>
                    <Text category="p1" style={styles.noVaultText}>There aren't any vaults here yet. Why not add one?</Text>
                    <Button onPress={handleAddVaultPress} style={styles.addButton}>Add Vault</Button>
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
        </SafeAreaView>
    );
}
