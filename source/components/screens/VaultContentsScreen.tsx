import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Icon, Layout, List, ListItem, TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { useState as useHookState } from "@hookstate/core";
import { EntryType, ENTRY_TYPES, GroupID } from "buttercup";
import { useGroupTitle, useVaultContents } from "../../hooks/buttercup";
import { useTabFocusState } from "../../hooks/vaultTab";
import { CURRENT_SOURCE } from "../../state/vault";
import { createNewGroup, deleteGroup } from "../../services/buttercup";
import { setBusyState } from "../../services/busyState";
import { notifyError, notifySuccess } from "../../library/notifications";
import { getIconForEntryType } from "../../library/buttercup";
import { VaultContentsMenu } from "../menus/VaultContentsMenu";
import { TextPrompt } from "../prompts/TextPrompt";
import { ConfirmPrompt } from "../prompts/ConfirmPrompt";
import { ItemsPrompt, PromptItem } from "../prompts/ItemsPrompt";
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

export function VaultContentsScreen({ navigation, route }) {
    useTabFocusState("contents");
    const { groupID = null } = route?.params ?? {};
    const entryTypes: Array<PromptItem> = useMemo(() => Object.keys(ENTRY_TYPES).map(typeKey => ({
        title: ENTRY_TYPES[typeKey].title,
        slug: ENTRY_TYPES[typeKey].slug,
        icon: getIconForEntryType(ENTRY_TYPES[typeKey].slug as EntryType)
    })), []);
    const currentSourceState = useHookState(CURRENT_SOURCE);
    const screenTitle = useGroupTitle(currentSourceState.get(), groupID) || "Contents";
    const deleteTitle = useGroupTitle(currentSourceState.get(), groupID) || "Unknown Group";
    const contents = useVaultContents(currentSourceState.get(), groupID);
    const preparedContents = useMemo(() => prepareListContents(contents), [contents]);
    const [promptGroupCreate, setPromptGroupCreate] = useState(false);
    const [promptDeleteGroupID, setPromptDeleteGroupID] = useState<GroupID>(null);
    const [promptNewEntryType, setPromptNewEntryType] = useState(false);
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
    const handleGroupDelete = useCallback(async () => {
        setBusyState("Deleting group");
        setPromptDeleteGroupID(null);
        try {
            await deleteGroup(currentSourceState.get(), groupID);
            notifySuccess("Group deleted", `Group was successfully deleted: ${deleteTitle}`);
            navigation.goBack();
        } catch (err) {
            console.error(err);
            notifyError("Failed deleting group", err.message);
        } finally {
            setBusyState(null);
        }
    }, [currentSourceState, deleteTitle, groupID, navigation]);
    const handleNewEntryCreate = useCallback((type: EntryType) => {
        setPromptNewEntryType(false);
        navigation.push("EditEntry", { entryID: null, entryType: type, groupID });
    }, [groupID, navigation]);
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
                        accessoryRight={() => (
                            <VaultContentsMenu
                                onEntryCreate={() => setPromptNewEntryType(true)}
                                onGroupCreate={() => setPromptGroupCreate(true)}
                                onGroupDelete={() => setPromptDeleteGroupID(groupID)}
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
            <ConfirmPrompt
                cancelable
                confirmText="Delete"
                onCancel={() => setPromptDeleteGroupID(null)}
                onConfirm={handleGroupDelete}
                prompt={`Remove group '${deleteTitle}'?`}
                title="Delete Group"
                visible={!!promptDeleteGroupID}
            />
            <ItemsPrompt
                items={entryTypes}
                onCancel={() => setPromptNewEntryType(false)}
                onSelect={(item: PromptItem) => handleNewEntryCreate(item.slug as EntryType)}
                visible={promptNewEntryType}
            />
        </>
    );
}
