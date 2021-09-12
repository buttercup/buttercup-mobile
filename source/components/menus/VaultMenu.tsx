import React, { useCallback, useState } from "react";
import { Image, SafeAreaView, StyleSheet, View } from "react-native";
import { VaultSourceID, VaultSourceStatus } from "buttercup";
import { Button, Card, Layout, Text, ViewPager } from "@ui-kitten/components";
import Dots from "react-native-dots-pagination";
import { TextPrompt } from "../prompts/TextPrompt";
import { useVaults } from "../../hooks/buttercup";
import { notifyError } from "../../library/notifications";
import { getVault, unlockSourceByID } from "../../services/buttercup";
import { setBusyState } from "../../services/busyState";
import { storeCredentialsForVault } from "../../services/intermediateCredentials";
import { VaultDetails } from "../../types";

const TUMBLEWEED_IMAGE = require("../../../resources/images/tumbleweed-512.png");

export interface VaultMenuProps {
    navigation: any;
    onVaultOpen?: (sourceID: VaultSourceID) => void;
}

const styles = StyleSheet.create({
    addButton: {
        marginTop: 26
    },
    card: {
        // flex: 1,
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
    const { navigation, onVaultOpen = null } = props;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const vaults: Array<VaultDetails> = useVaults();
    const [unlockVaultTarget, setUnlockVaultTarget] = useState<VaultSourceID>(null);
    const handlePageSelect = useCallback(index => {
        setSelectedIndex(index);
    }, []);
    const handleVaultPress = useCallback(
        (vault: VaultDetails) => {
            if (vault.state === VaultSourceStatus.Unlocked) {
                onVaultOpen(vault.id);
            } else if (vault.state === VaultSourceStatus.Locked) {
                setUnlockVaultTarget(vault.id);
            }
        },
        [onVaultOpen]
    );
    const handleAddVaultPress = useCallback(() => {
        navigation.navigate("AddVault");
    }, [navigation]);
    const handleUnlockPromptComplete = useCallback((password: string) => {
        const sourceID = unlockVaultTarget;
        setUnlockVaultTarget(null);
        setBusyState("Unlocking vault");
        unlockSourceByID(sourceID, password)
            .then(() => {
                setBusyState("Updating auto-fill");
                const vault = getVault(sourceID);
                return storeCredentialsForVault(sourceID, vault, password);
            })
            .then(() => {
                setBusyState(null);
                onVaultOpen(sourceID);
            })
            .catch(err => {
                console.error(err);
                notifyError("Failed unlocking vault", err.message);
                setBusyState(null);
                setUnlockVaultTarget(sourceID);
            });
    }, [onVaultOpen, unlockVaultTarget]);
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
                        source={TUMBLEWEED_IMAGE}
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
