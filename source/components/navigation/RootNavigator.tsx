import React from "react";
import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { withStyles } from "@ui-kitten/components";
import { useSingleState } from "react-obstate";
import { OTPProvider } from "../../contexts/otp";
import { HomeNavigator } from "./HomeNavigator";
import { VaultManagementScreen } from "../screens/VaultManagementScreen";
import { AboutScreen } from "../screens/AboutScreen";
import { AddVaultScreen } from "../screens/AddVaultScreen";
import { VaultContentsScreen } from "../screens/VaultContentsScreen";
import { EntryDetailsScreen } from "../screens/EntryDetailsScreen";
import { EditEntryScreen } from "../screens/EditEntryScreen";
import { CoverScreen } from "../screens/CoverScreen";
import { PasswordGeneratorScreen } from "../screens/PasswordGeneratorScreen";
import { VaultNavigator } from "./VaultNavigator";
import { ErrorBoundary } from "../ErrorBoundary";
import { useAllOTPItems, useSourceOTPItems } from "../../hooks/otp";
import { VAULT } from "../../state/vault";
import { rootNavigationRef } from "../../state/navigation";

const { Navigator, Screen } = createStackNavigator();

const StandardNavigator = () => (
    <Navigator screenOptions={{ headerShown: false }}>
        <Screen name="Home" component={HomeNavigator} />
        <Screen name="About" component={AboutScreen} />
        <Screen name="Vault" component={VaultNavigator} />
        <Screen name="AddVault" component={AddVaultScreen} />
        <Screen name="ManageVaults" component={VaultManagementScreen} />
        {/* */}
        <Screen name="VaultContents" component={VaultContentsScreen} />
        <Screen name="EntryDetails" component={EntryDetailsScreen} />
        <Screen name="EditEntry" component={EditEntryScreen} />
        {/* */}
        <Screen name="Cover" component={CoverScreen} />
    </Navigator>
);

const ModalNavigator = () => (
    <Navigator screenOptions={{ headerShown: false }}>
        <Screen name="PasswordGenerator" component={PasswordGeneratorScreen} />
    </Navigator>
);

const RootNavigator = () => (
    <Navigator screenOptions={{ headerShown: false, presentation: "modal" }}>
        <Screen name="Main" component={StandardNavigator} />
        <Screen name="Modal" component={ModalNavigator} />
    </Navigator>
);

const _ThemedSafeAreaView = ({ eva }) => (
    <SafeAreaView
        style={{
            flex: 0,
            backgroundColor: eva.theme["background-basic-color-1"]
        }}
    />
);
const ThemedSafeAreaView = withStyles(_ThemedSafeAreaView);

export function AppNavigator({ eva }) {
    const [currentSource] = useSingleState(VAULT, "currentSource");
    const sourceOTPItems = useSourceOTPItems(currentSource);
    const allOTPs = useAllOTPItems();
    return (
        <NavigationContainer ref={rootNavigationRef}>
            <ThemedSafeAreaView eva={eva} />
            <ErrorBoundary>
                <OTPProvider allOTPItems={allOTPs} currentSourceOTPItems={sourceOTPItems}>
                    <RootNavigator />
                </OTPProvider>
            </ErrorBoundary>
            <ThemedSafeAreaView eva={eva} />
        </NavigationContainer>
    );
}
