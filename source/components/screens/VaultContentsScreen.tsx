import React, { Fragment, useCallback, useContext, useMemo, useState } from "react";
import { SafeAreaView } from "react-native";
import { Divider, Icon, Layout, TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { useState as useHookState } from "@hookstate/core";
import { EntryType, ENTRY_TYPES, GroupID } from "buttercup";
import { VaultContext } from "../../contexts/vault";
import { useGroupTitle, useVaultContents } from "../../hooks/buttercup";
import { useTabFocusState } from "../../hooks/vaultTab";
import { CURRENT_SOURCE } from "../../state/vault";
import { createNewGroup, deleteGroup } from "../../services/buttercup";
import { setBusyState } from "../../services/busyState";
import { notifyError, notifySuccess } from "../../library/notifications";
import { getIconForEntryType } from "../../library/buttercup";
import { ReadOnlyBar } from "../navigation/ReadOnlyBar";
import { VaultContentsMenu } from "../menus/VaultContentsMenu";
import { TextPrompt } from "../prompts/TextPrompt";
import { ConfirmPrompt } from "../prompts/ConfirmPrompt";
import { ItemsPrompt, PromptItem } from "../prompts/ItemsPrompt";
import { VaultContentsList } from "./vault-contents/VaultContentsList";

const BackIcon = props => <Icon {...props} name="corner-left-up-outline" />;

export function VaultContentsScreen({ navigation, route }) {
    useTabFocusState("contents", "Vault Contents");
    const { groupID = null } = route?.params ?? {};
    const { readOnly } = useContext(VaultContext);
    const entryTypes: Array<PromptItem> = useMemo(() => Object.keys(ENTRY_TYPES).map(typeKey => ({
        title: ENTRY_TYPES[typeKey].title,
        slug: ENTRY_TYPES[typeKey].slug,
        icon: getIconForEntryType(ENTRY_TYPES[typeKey].slug as EntryType)
    })), []);
    const currentSourceState = useHookState(CURRENT_SOURCE);
    const screenTitle = useGroupTitle(currentSourceState.get(), groupID) || "Contents";
    const deleteTitle = useGroupTitle(currentSourceState.get(), groupID) || "Unknown Group";
    const contents = useVaultContents(currentSourceState.get(), groupID);
    const [promptGroupCreate, setPromptGroupCreate] = useState(false);
    const [promptDeleteGroupID, setPromptDeleteGroupID] = useState<GroupID>(null);
    const [promptNewEntryType, setPromptNewEntryType] = useState(false);
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
                    <Fragment>
                        <TopNavigation
                            title={screenTitle}
                            alignment="center"
                            accessoryLeft={BackAction}
                            accessoryRight={() => (
                                <VaultContentsMenu
                                    onEntryCreate={() => setPromptNewEntryType(true)}
                                    onGroupCreate={() => setPromptGroupCreate(true)}
                                    onGroupDelete={() => setPromptDeleteGroupID(groupID)}
                                    readOnly={readOnly}
                                />
                            )}
                        />
                        {readOnly && (
                            <ReadOnlyBar />
                        )}
                        <Divider />
                    </Fragment>
                )}
                <Layout style={{ flex: 1 }}>
                    <VaultContentsList
                        contents={contents}
                        groupID={groupID}
                        navigation={navigation}
                        type="group"
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
