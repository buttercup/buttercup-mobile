import React, { useCallback, useMemo } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Icon, Layout, List, ListItem, TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { useState as useHookState } from "@hookstate/core";
import { useVaultContents } from "../../hooks/buttercup";
import { CURRENT_SOURCE } from "../../state/vault";
import { navigate } from "../../state/navigation";
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
    listContainer: {
    //   maxHeight: 320,
    },
    contentContainer: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    item: {
      marginVertical: 4,
    },
    card: {
        flex: 1,
        padding: 0
    }
});

function prepareListContents(items: Array<VaultContentsItem>): Array<VaultContentsItemDisplay> {
    return items.map(item => ({
        title: item.title,
        subtitle: "Nothing here yet",
        icon: item.type === "group" ? "folder-outline" : "file-outline",
        sourceItem: item
    }));
}

function renderItem(info: RenderInfo) {
    const { item } = info;
    return (
        <ListItem
            title={item.title}
            description={item.subtitle}
            accessoryLeft={props => renderItemIcon(props, item.icon)}
            onPress={() => {
                if (item.sourceItem.type === "group") {
                    navigate(
                        "VaultContents",
                        {
                            groupID: item.sourceItem.id
                        }
                    );
                } else {
                    // Entry
                    navigate(
                        "EntryDetails",
                        {
                            entryID: item.sourceItem.id
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
    const { groupID = null } = route?.params ?? {};
    const currentSourceState = useHookState(CURRENT_SOURCE);
    const contents = useVaultContents(currentSourceState.get(), groupID);
    const preparedContents = useMemo(() => prepareListContents(contents), [contents]);
    const renderWrapper = useCallback(
        (info: RenderInfo) => renderItem(info),
        []
    );
    const navigateBack = () => {
        navigation.goBack();
    };
    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {groupID && (
                <TopNavigation title="Contents" alignment="center" accessoryLeft={BackAction} />
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
    );
}
