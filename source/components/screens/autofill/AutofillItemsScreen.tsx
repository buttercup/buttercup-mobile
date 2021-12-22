import React, { useCallback, useMemo } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Icon, Layout, List, ListItem, TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { useState as useHookState } from "@hookstate/core";
import { AutoFillBridge } from "../../../services/autofillBridge";
import { CURRENT_SOURCE } from "../../../state/vault";
import { LOGIN_ENTRIES } from "../../../state/autofill";
import { IntermediateEntry } from "../../../types";

interface VaultContentsItemDisplay {
    title: string;
    subtitle: string | null;
    icon: string;
    sourceItem: IntermediateEntry;
}

const BackIcon = props => <Icon {...props} name="corner-left-up-outline" />;
const CancelIcon = props => <Icon {...props} name="close-square-outline" />;

const styles = StyleSheet.create({
    listContainer: {},
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

function prepareListContents(items: Array<IntermediateEntry>): Array<VaultContentsItemDisplay> {
    return items.map(item => ({
        title: item.title,
        subtitle: item.username,
        icon: "file-outline",
        sourceItem: item
    }));
}

function renderItem(info) {
    const { item } = info as { item: VaultContentsItemDisplay };
    return (
        <ListItem
            title={item.title}
            description={item.subtitle}
            accessoryLeft={props => renderItemIcon(props, item.icon)}
            onPress={() => {
                AutoFillBridge.completeAutoFill(item.sourceItem.username, item.sourceItem.password, "");
            }}
        />
    );
}

function renderItemIcon(props, icon) {
    return (
        <Icon {...props} name={icon} />
    );
}

export function AutofillItemsScreen({ navigation }) {
    const currentSourceState = useHookState(CURRENT_SOURCE);
    const loginItemsState = useHookState(LOGIN_ENTRIES);
    const loginItems = loginItemsState.get()[currentSourceState.get()] as Array<IntermediateEntry>;
    const preparedContents = useMemo(() => prepareListContents(loginItems), [loginItems]);
    const renderWrapper = useMemo(() =>
        renderItem,
        []
    );
    const navigateBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);
    const cancelAutoFill = useCallback(() => {
        AutoFillBridge.cancelAutoFill();
    }, []);
    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
    const CancelAction = () => <TopNavigationAction icon={CancelIcon} onPress={cancelAutoFill} />;
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigation title="Logins" alignment="center" accessoryLeft={BackAction} accessoryRight={CancelAction} />
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
