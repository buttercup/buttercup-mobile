import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import {
    Avatar,
    Button,
    Divider,
    Icon,
    Layout,
    MenuItem,
    OverflowMenu,
    TopNavigation,
    Text
} from "@ui-kitten/components";
import { VaultSourceID } from "buttercup";
import { VaultMenu } from "../../menus/VaultMenu";
import { getCredentialsForVault, getStoredVaults } from "../../../services/intermediateCredentials";
import { CURRENT_SOURCE } from "../../../state/vault";
import { LOGIN_ENTRIES } from "../../../state/autofill";
import { VaultDetails } from "../../../types";

const BCUP_ICON = require("../../../../resources/images/bcup-256.png");

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
    const handleVaultOpen = useCallback(
        (sourceID: VaultSourceID) => {
            CURRENT_SOURCE.set(sourceID);
            // getCredentialsForVault(sourceID, "test");
            navigation.navigate("Items");
        },
        [navigation]
    );
    const handleVaultUnlock = useCallback(async (sourceID: VaultSourceID, password: string) => {
        const credentials = await getCredentialsForVault(sourceID, password);
        LOGIN_ENTRIES.set(credentials);
        CURRENT_SOURCE.set(sourceID);
        navigation.navigate("Items");
        // console.log("UNLOCK", sourceID, password);
    }, [navigation]);
    useEffect(() => {
        let mounted = true;
        getStoredVaults().then(storedVaults => {
            if (!mounted) return;
            setVaults(storedVaults);
        });
        return () => {
            mounted = false;
        };
    }, []);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigation
                title={props => (
                    <Layout style={styles.header}>
                        <Avatar
                            shape="square"
                            size="tiny"
                            source={BCUP_ICON}
                            style={styles.logo}
                        />
                        <Text {...props} category="h5">
                            Buttercup
                        </Text>
                    </Layout>
                )}
                alignment="center"
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
