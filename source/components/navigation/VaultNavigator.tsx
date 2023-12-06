import React, { useCallback, useContext, useState } from "react";
import { SafeAreaView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    BottomNavigation,
    BottomNavigationTab,
    Divider,
    Icon,
    TopNavigation,
    TopNavigationAction
} from "@ui-kitten/components";
import { GroupID } from "buttercup";
import { useSingleState } from "react-obstate";
import { useFocusedTab } from "../../hooks/vaultTab";
import { VAULT } from "../../state/vault";
import { createNewGroup } from "../../services/buttercup";
import { setBusyState } from "../../services/busyState";
import { notifyError, notifySuccess } from "../../library/notifications";
import { VaultContext } from "../../contexts/vault";
import { ReadOnlyBar } from "./ReadOnlyBar";
import { SearchScreen } from "../screens/SearchScreen";
import { VaultContentsScreen } from "../screens/VaultContentsScreen";
import { VaultCodesScreen } from "../screens/VaultCodesScreen";
import { VaultSettingsScreen } from "../screens/VaultSettingsScreen";
import { TextPrompt } from "../prompts/TextPrompt";
import { VaultContentsMenu } from "../menus/VaultContentsMenu";

const { Navigator, Screen } = createBottomTabNavigator();

const BackIcon = props => <Icon {...props} name="arrow-back" />;
const CodesIcon = props => <Icon {...props} name="keypad-outline" />;
const FolderIcon = props => <Icon {...props} name="folder-outline" />;
const SearchIcon = props => <Icon {...props} name="search-outline" />;
const SettingsIcon = props => <Icon {...props} name="settings-outline" />;

function BottomTabBar({ navigation, state }) {
    return (
        <>
            <Divider />
            <BottomNavigation
                selectedIndex={state.index}
                onSelect={index => navigation.navigate(state.routeNames[index])}
            >
                <BottomNavigationTab title="GROUPS" icon={FolderIcon} />
                <BottomNavigationTab title="SEARCH" icon={SearchIcon} />
                <BottomNavigationTab title="CODES" icon={CodesIcon} />
                <BottomNavigationTab title="SETTINGS" icon={SettingsIcon} />
            </BottomNavigation>
        </>
    );
}

function TabNavigator() {
    return (
        <Navigator
            tabBar={props => <BottomTabBar {...props} />}
            screenOptions={{
                headerShown: false
            }}
        >
            <Screen name="Groups" component={VaultContentsScreen} />
            <Screen name="Search" component={SearchScreen} />
            <Screen name="Codes" component={VaultCodesScreen} />
            <Screen name="Settings" component={VaultSettingsScreen} />
        </Navigator>
    );
}

export function VaultNavigator({ navigation }) {
    const { readOnly } = useContext(VaultContext);
    const [focusedTab, focusedTabTitle] = useFocusedTab();
    const [promptGroupCreate, setPromptGroupCreate] = useState(false);
    const [currentSource] = useSingleState(VAULT, "currentSource");
    const handleGroupCreate = useCallback(
        async (groupName: string) => {
            setBusyState("Creating group");
            setPromptGroupCreate(false);
            let newGroupID: GroupID;
            try {
                newGroupID = await createNewGroup(currentSource, groupName);
                notifySuccess("Group created", `Group was successfully created: ${groupName}`);
            } catch (err) {
                console.error(err);
                notifyError("Failed creating group", err.message);
            } finally {
                setBusyState(null);
            }
            if (newGroupID) {
                navigation.push("VaultContents", {
                    groupID: newGroupID
                });
            }
        },
        [currentSource, navigation]
    );
    const navigateBack = () => {
        navigation.goBack();
    };
    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
    return (
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
                                readOnly={readOnly}
                            />
                        )}
                    </>
                )}
            />
            {readOnly && <ReadOnlyBar />}
            <Divider />
            <TabNavigator />
            <TextPrompt
                cancelable
                onCancel={() => setPromptGroupCreate(false)}
                onSubmit={handleGroupCreate}
                prompt="New group title"
                submitText="Create"
                visible={promptGroupCreate}
            />
        </SafeAreaView>
    );
}
