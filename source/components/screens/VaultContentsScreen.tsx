import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Button, Icon, Layout, List, ListItem, MenuItem, OverflowMenu, TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { useState as useHookState } from "@hookstate/core";
import { GroupID } from "buttercup";
import { useGroupTitle, useVaultContents } from "../../hooks/buttercup";
import { CURRENT_SOURCE } from "../../state/vault";
import { createNewGroup } from "../../services/buttercup";
import { setBusyState } from "../../services/busyState";
import { notifyError, notifySuccess } from "../../library/notifications";
import { TextPrompt } from "../prompts/TextPrompt";
import { VaultContentsItem } from "../../types";

interface RenderInfo {
    item: VaultContentsItemDisplay;
}
interface VaultContentsItemDisplay {
    title: string;
    subtitle: string | null;
    icon: string;
    sourceItem: VaultContentsItem;
}

const MENU_ITEMS = [
    { text: "Add Group", slug: "add-group", icon: "folder-outline" },
    { text: "Add Entry", slug: "add-entry", icon: "file-outline" },
    { text: "Delete Current Group", slug: "delete-group", icon: "folder-remove-outline" }
];

const BackIcon = props => <Icon {...props} name="corner-left-up-outline" />;

const styles = StyleSheet.create({
    card: {
        flex: 1,
        padding: 0
    },
    contentContainer: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    item: {
      marginVertical: 4,
    },
    listContainer: {},
    menuContent: {}
});

function prepareListContents(items: Array<VaultContentsItem>): Array<VaultContentsItemDisplay> {
    return items.map(item => ({
        title: item.title,
        subtitle: "Nothing here yet",
        icon: item.type === "group" ? "folder-outline" : "file-outline",
        sourceItem: item
    }));
}

function renderItem(info: RenderInfo, groupID: GroupID, navigation: any) {
    const { item } = info;
    return (
        <ListItem
            title={item.title}
            description={item.subtitle}
            accessoryLeft={props => renderItemIcon(props, item.icon)}
            onPress={() => {
                if (item.sourceItem.type === "group") {
                    navigation.push(
                        "VaultContents",
                        {
                            groupID: item.sourceItem.id
                        }
                    );
                } else {
                    // Entry
                    navigation.push(
                        "EntryDetails",
                        {
                            entryID: item.sourceItem.id,
                            groupID
                        }
                    );
                }
            }}
        />
    );
}

function renderItemIcon(props, icon) {
    return (
        <Icon {...props} name={icon} />
    );
}

function MenuButton(props) {
    const { groupID, navigation, onGroupCreate } = props;
    const [visible, setVisible] = useState(false);
    const onItemSelect = selected => {
        const item = MENU_ITEMS[selected.row];
        setVisible(false);
        if (item.slug === "add-group") {
            onGroupCreate();
        } else if (item.slug === "add-entry") {
            navigation.push("EditEntry", { entryID: null, groupID });
        }
    };

    const renderToggleButton = () => (
        <Button
            {...props}
            appearance="ghost"
            accessoryLeft={MenuIcon}
            onPress={() => setVisible(true)}
            status="basic"
        />
    );

    return (
        <Layout style={styles.menuContent} level="1">
            <OverflowMenu
                anchor={renderToggleButton}
                visible={visible}
                onSelect={onItemSelect}
                onBackdropPress={() => setVisible(false)}
            >
                {MENU_ITEMS.map(item => (
                    <MenuItem
                        key={item.slug}
                        title={item.text}
                        accessoryLeft={props => <Icon {...props} name={item.icon} />}
                    />
                ))}
            </OverflowMenu>
        </Layout>
    );
}

function MenuIcon(props) {
    return <Icon {...props} name="menu-outline" />;
}

export function VaultContentsScreen({ navigation, route }) {
    const { groupID = null } = route?.params ?? {};
    const currentSourceState = useHookState(CURRENT_SOURCE);
    const screenTitle = useGroupTitle(currentSourceState.get(), groupID) || "Contents";
    const contents = useVaultContents(currentSourceState.get(), groupID);
    const preparedContents = useMemo(() => prepareListContents(contents), [contents]);
    const [promptGroupCreate, setPromptGroupCreate] = useState(false);
    const renderWrapper = useCallback(
        (info: RenderInfo) => renderItem(info, groupID, navigation),
        []
    );
    const handleGroupCreate = useCallback(async (groupName: string) => {
        setBusyState("Creating group");
        setPromptGroupCreate(false);
        let newGroupID: GroupID;
        try {
            newGroupID = await createNewGroup(currentSourceState.get(), groupName, groupID);
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
    }, [currentSourceState, groupID]);
    const navigateBack = () => {
        navigation.goBack();
    };
    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                {groupID && (
                    <TopNavigation
                        title={screenTitle}
                        alignment="center"
                        accessoryLeft={BackAction}
                        accessoryRight={props => (
                            <MenuButton
                                {...props}
                                groupID={groupID}
                                navigation={navigation}
                                onGroupCreate={() => setPromptGroupCreate(true)}
                            />
                        )}
                    />
                )}
                <Layout style={{ flex: 1 }}>
                    <List
                        style={styles.listContainer}
                        contentContainerStyle={styles.contentContainer}
                        data={preparedContents}
                        renderItem={renderWrapper}
                    />
                </Layout>
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
