import React from "react";
import { SafeAreaView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    BottomNavigation,
    BottomNavigationTab,
    Icon,
    Layout,
    Text,
    TopNavigation,
    TopNavigationAction
} from "@ui-kitten/components";
import { VaultContentsScreen } from "../screens/VaultContentsScreen";
import { WalletScreen } from "../screens/WalletScreen";
import { CodesScreen } from "../screens/CodesScreen";

const { Navigator, Screen } = createBottomTabNavigator();

const BackIcon = props => <Icon {...props} name="arrow-back" />;
const CodesIcon = props => <Icon {...props} name="checkmark-circle-outline" />;
const FolderIcon = props => <Icon {...props} name="folder-outline" />;
const SearchIcon = props => <Icon {...props} name="search-outline" />;
const SettingsIcon = props => <Icon {...props} name="settings-outline" />;
const WalletIcon = props => <Icon {...props} name="credit-card-outline" />;

const SearchScreen = () => (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text category="h1">SEARCH</Text>
    </Layout>
);

const SettingsScreen = () => (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text category="h1">SETTINGS</Text>
    </Layout>
);

const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}
    >
        <BottomNavigationTab title="SEARCH" icon={SearchIcon} />
        <BottomNavigationTab title="GROUPS" icon={FolderIcon} />
        <BottomNavigationTab title="WALLET" icon={WalletIcon} />
        <BottomNavigationTab title="CODES" icon={CodesIcon} />
        <BottomNavigationTab title="SETTINGS" icon={SettingsIcon} />
    </BottomNavigation>
);

const TabNavigator = () => (
    <Navigator tabBar={props => <BottomTabBar {...props} />}>
        <Screen name="Search" component={SearchScreen} />
        <Screen name="Groups" component={VaultContentsScreen} />
        <Screen name="Wallet" component={WalletScreen} />
        <Screen name="Codes" component={CodesScreen} />
        <Screen name="Settings" component={SettingsScreen} />
    </Navigator>
);

export function VaultNavigator({ navigation }) {
    const navigateBack = () => {
        navigation.goBack();
    };
    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigation title="Vault" alignment="center" accessoryLeft={BackAction} />
            <TabNavigator />
        </SafeAreaView>
    );
}
