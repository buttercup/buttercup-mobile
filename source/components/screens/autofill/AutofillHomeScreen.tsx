import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import {
    Avatar,
    Divider,
    Icon,
    Layout,
    TopNavigation,
    TopNavigationAction,
    Text
} from "@ui-kitten/components";
import { VaultSourceID, VaultSourceStatus } from "buttercup";
import { VaultMenu } from "../../menus/VaultMenu";
import { getCredentialsForVault, getStoredVaults } from "../../../services/intermediateCredentials";
import { AutoFillBridge } from "../../../services/autofillBridge";
import { VAULT } from "../../../state/vault";
import { AUTOFILL } from "../../../state/autofill";
import { VaultDetails } from "../../../types";
import BCUP_ICON from "../../../../resources/images/bcup-256.png";

const CancelIcon = props => <Icon {...props} name="close-square-outline" />;

const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        marginHorizontal: 4
    },
    menuContent: {}
});

export function AutofillHomeScreen({ navigation }) {
    const [vaults, setVaults] = useState<Array<VaultDetails>>([]);
    const [unlockedVaults, setUnlockedVaults] = useState<Array<VaultSourceID>>([]);
    const handleVaultOpen = useCallback(
        (sourceID: VaultSourceID) => {
            VAULT.currentSource = sourceID;
            navigation.navigate("Items");
        },
        [navigation]
    );
    const handleVaultUnlock = useCallback(
        async (sourceID: VaultSourceID, password: string) => {
            const credentials = await getCredentialsForVault(sourceID, password);
            AUTOFILL.entries = {
                ...AUTOFILL.entries,
                [sourceID]: credentials
            };
            VAULT.currentSource = sourceID;
            setUnlockedVaults([...unlockedVaults, sourceID]);
            navigation.navigate("Items");
        },
        [navigation, unlockedVaults]
    );
    const cancelAutoFill = useCallback(() => {
        AutoFillBridge.cancelAutoFill();
    }, []);
    useEffect(() => {
        let mounted = true;
        getStoredVaults().then(storedVaults => {
            if (!mounted) return;
            setVaults(
                storedVaults.map(vault => ({
                    ...vault,
                    state: unlockedVaults.includes(vault.id)
                        ? VaultSourceStatus.Unlocked
                        : VaultSourceStatus.Locked
                }))
            );
        });
        return () => {
            mounted = false;
        };
    }, [unlockedVaults]);
    const CancelAction = () => <TopNavigationAction icon={CancelIcon} onPress={cancelAutoFill} />;
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigation
                title={props => (
                    <Layout style={styles.header}>
                        <Avatar shape="square" size="tiny" source={BCUP_ICON} style={styles.logo} />
                        <Text {...props} category="h5">
                            Buttercup
                        </Text>
                    </Layout>
                )}
                alignment="center"
                accessoryRight={CancelAction}
            />
            <Divider />
            <Layout style={{ flex: 1 }}>
                <VaultMenu
                    handleVaultUnlock={handleVaultUnlock}
                    navigation={navigation}
                    onVaultOpen={handleVaultOpen}
                    vaultsOverride={vaults}
                />
            </Layout>
        </SafeAreaView>
    );
}
