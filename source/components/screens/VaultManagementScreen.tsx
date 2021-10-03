import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import {
    Divider,
    Icon,
    Layout,
    List,
    ListItem,
    Text,
    TopNavigation,
    TopNavigationAction
} from "@ui-kitten/components";
import { VaultSourceID } from "buttercup";
import { ItemsPrompt, PromptItem } from "../prompts/ItemsPrompt";
import { ConfirmPrompt } from "../prompts/ConfirmPrompt";
import { useVaults } from "../../hooks/buttercup";
import { removeVaultSource } from "../../services/buttercup";
import { notifyError, notifySuccess } from "../../library/notifications";
import { VaultDetails } from "../../types";

interface RenderInfo {
    item: VaultItemDisplay;
}
interface VaultItemDisplay {
    title: string;
    subtitle: string | null;
    icon: string;
    source: VaultDetails;
}

const VAULT_OPTIONS = [
    {
        title: "Remove",
        slug: "remove",
        icon: "trash-2-outline"
    }
];

const BackIcon = props => <Icon {...props} name="arrow-back" />;

const styles = StyleSheet.create({
    contentContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    }
});

function prepareListContents(items: Array<VaultDetails>): Array<VaultItemDisplay> {
    return items.map(item => ({
        title: item.name,
        subtitle: item.type,
        icon: "file-outline",
        source: item
    }));
}

function renderItem(info: RenderInfo, onItemPress: (item: VaultItemDisplay) => void, navigation: any) {
    const { item } = info;
    return (
        <ListItem
            title={item.title}
            description={item.subtitle}
            accessoryLeft={props => renderItemIcon(props, item.icon)}
            onPress={() => {
                onItemPress(item);
            }}
        />
    );
}

function renderItemIcon(props, icon) {
    return (
        <Icon {...props} name={icon} />
    );
}

export function VaultManagementScreen({ navigation }) {
    const vaults = useVaults();
    const preparedContents = useMemo(() => prepareListContents(vaults), [vaults]);
    const [selectedVaultID, setSelectedVaultID] = useState<VaultSourceID>(null);
    const [removeVaultID, setRemoveVaultID] = useState<VaultSourceID>(null);
    const removeVaultTitle = useMemo(() => removeVaultID ? vaults.find(v => v.id === removeVaultID).name : "", [removeVaultID]);
    const navigateBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);
    const handleVaultPress = useCallback((vault: VaultItemDisplay) => {
        setSelectedVaultID(vault.source.id);
    }, []);
    const handleVaultOptionSelect = useCallback((item: PromptItem) => {
        if (item.slug === "remove") {
            setRemoveVaultID(selectedVaultID);
        }
        setSelectedVaultID(null);
    }, [selectedVaultID]);
    const handleVaultRemoval = useCallback(async () => {
        try {
            await removeVaultSource(removeVaultID);
            notifySuccess("Vault removed", `Successfully removed: ${removeVaultTitle}`);
        } catch (err) {
            console.error(err);
            notifyError("Failed removing vault", err.message);
        } finally {
            setRemoveVaultID(null);
        }
    }, [removeVaultID, removeVaultTitle]);
    const renderWrapper = useCallback(
        (info: RenderInfo) => renderItem(info, handleVaultPress, navigation),
        [handleVaultPress, navigation]
    );
    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <TopNavigation title="Vaults" alignment="center" accessoryLeft={BackAction} />
                <Divider />
                <List
                    contentContainerStyle={styles.contentContainer}
                    data={preparedContents}
                    renderItem={renderWrapper}
                />
            </SafeAreaView>
            <ItemsPrompt
                items={VAULT_OPTIONS}
                onCancel={() => setSelectedVaultID(null)}
                onSelect={handleVaultOptionSelect}
                visible={!!selectedVaultID}
            />
            <ConfirmPrompt
                cancelable
                confirmText="Remove"
                onCancel={() => setRemoveVaultID(null)}
                onConfirm={handleVaultRemoval}
                prompt={`Remove vault '${removeVaultTitle}'?`}
                title="Remove Vault"
                visible={!!removeVaultID}
            />
        </>
    );
}
