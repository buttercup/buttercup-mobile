import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    BottomNavigation,
    BottomNavigationTab,
    Icon,
    TopNavigation,
    TopNavigationAction
} from "@ui-kitten/components";
import { GroupID } from "buttercup";
import { useState as useHookState } from "@hookstate/core";
import { useFocusedTab } from "../../hooks/vaultTab";
import { useSourceOTPItems } from "../../hooks/otp";
import { OTPProvider } from "../../contexts/otp";
import { CURRENT_SOURCE } from "../../state/vault";
import { createNewGroup } from "../../services/buttercup";
import { setBusyState } from "../../services/busyState";
import { notifyError, notifySuccess } from "../../library/notifications";
import { SearchScreen } from "../screens/SearchScreen";
import { VaultContentsScreen } from "../screens/VaultContentsScreen";
import { WalletScreen } from "../screens/WalletScreen";
import { CodesScreen } from "../screens/CodesScreen";
import { VaultSettingsScreen } from "../screens/VaultSettingsScreen";
import { TextPrompt } from "../prompts/TextPrompt";
import { VaultContentsMenu } from "../menus/VaultContentsMenu";

const { Navigator, Screen } = createBottomTabNavigator();

const BackIcon = props => <Icon {...props} name="arrow-back" />;
const CodesIcon = props => <Icon {...props} name="checkmark-circle-outline" />;
const FolderIcon = props => <Icon {...props} name="folder-outline" />;
const SearchIcon = props => <Icon {...props} name="search-outline" />;
const SettingsIcon = props => <Icon {...props} name="settings-outline" />;
const WalletIcon = props => <Icon {...props} name="credit-card-outline" />;

function BottomTabBar({ navigation, state }) {
    return (
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
}

function TabNavigator() {
    return (
        <Navigator tabBar={props => <BottomTabBar {...props} />}>
            <Screen name="Search" component={SearchScreen} />
            <Screen name="Groups" component={VaultContentsScreen} />
            <Screen name="Wallet" component={WalletScreen} />
            <Screen name="Codes" component={CodesScreen} />
            <Screen name="Settings" component={VaultSettingsScreen} />
        </Navigator>
    );
}

export function VaultNavigator({ navigation }) {
    const [focusedTab, focusedTabTitle] = useFocusedTab();
    const [promptGroupCreate, setPromptGroupCreate] = useState(false);
    const currentSourceState = useHookState(CURRENT_SOURCE);
    const sourceOTPItems = useSourceOTPItems(currentSourceState.get());
    const handleGroupCreate = useCallback(async (groupName: string) => {
        setBusyState("Creating group");
        setPromptGroupCreate(false);
        let newGroupID: GroupID;
        try {
            newGroupID = await createNewGroup(currentSourceState.get(), groupName);
            notifySuccess("Group created", `Group was successfully created: ${groupName}`);
        } catch (err) {
            console.error(err);
            notifyError("Failed creating group", err.message);
        } finally {
            setBusyState(null);
        }
        if (newGroupID) {
            navigation.push(
                "VaultContents",
                {
                    groupID: newGroupID
                }
            );
        }
    }, [currentSourceState]);
    const navigateBack = () => {
        navigation.goBack();
    };
    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <TopNavigation
                    title={focusedTabTitle}
                    alignment="center"
                    accessoryLeft={BackAction}
                    accessoryRight={() => (
                        <>
                            {focusedTab === "contents" && (
                                <VaultContentsMenu
                                    onGroupCreate={() => setPromptGroupCreate(true)}
                                />
                            )}
                        </>
                    )}
                />
                <OTPProvider
                    otpItems={sourceOTPItems}
                >
                    <TabNavigator />
                </OTPProvider>
            </SafeAreaView>
            <TextPrompt
                cancelable
                onCancel={() => setPromptGroupCreate(false)}
                onSubmit={handleGroupCreate}
                prompt="New group title"
                submitText="Create"
                visible={promptGroupCreate}
            />
        </>
    );
}
