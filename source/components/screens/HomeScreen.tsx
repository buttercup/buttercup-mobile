import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { Layout } from "@ui-kitten/components";
import { useNavigationState } from "@react-navigation/native";
import { VaultSourceID } from "buttercup";
import { VaultMenu } from "../menus/VaultMenu";
import { HomeTopBar } from "../menus/HomeTopBar";
import { ErrorBoundary } from "../ErrorBoundary";
import { VAULT } from "../../state/vault";

export function HomeScreen({ navigation }) {
    const handleVaultOpen = useCallback(
        (sourceID: VaultSourceID) => {
            VAULT.currentSource = sourceID;
            navigation.navigate("Vault");
        },
        [navigation]
    );
    const [currentNavIndex, setCurrentNavIndex] = useState<number>(0);
    const currentNav = useNavigationState(state => state.index);
    useEffect(() => {
        if (currentNavIndex > 0 && currentNav === 0) {
            // Navigated back to root
            VAULT.currentSource = null;
        }
        setCurrentNavIndex(currentNav);
    }, [currentNav, currentNavIndex]);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HomeTopBar leftMenu="vaults" navigation={navigation} />
            <Layout style={{ flex: 1 }}>
                <ErrorBoundary>
                    <VaultMenu navigation={navigation} onVaultOpen={handleVaultOpen} />
                </ErrorBoundary>
            </Layout>
        </SafeAreaView>
    );
}
