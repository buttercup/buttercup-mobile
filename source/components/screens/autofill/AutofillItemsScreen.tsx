import React, { useCallback, useContext, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Icon, Layout, List, ListItem, Spinner, TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { useSingleState } from "react-obstate";
import { SearchBar } from "../search/SearchBar";
import { AutofillContext } from "../../../contexts/autofill";
import { AutoFillBridge } from "../../../services/autofillBridge";
import { VAULT } from "../../../state/vault";
import { AUTOFILL } from "../../../state/autofill";
import { extractDomain } from "../../../library/url";
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
    spinnerContainer: {
        flexGrow: 0,
        flexShrink: 1,
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 18
    }
});

function domainMatchEntries(entries: Array<VaultContentsItemDisplay>, domains: Array<string>): Array<VaultContentsItemDisplay> {
    return entries.filter(entry =>
        entry.sourceItem.urls.some(url => {
            const urlDomain = extractDomain(url);
            return domains.some(
                domain => domainsMatch(urlDomain, domain)
            );
        })
    );
}

function domainsMatch(domain1: string, domain2: string): boolean {
    return domain1 === domain2 || domain1.endsWith(domain2) || domain2.endsWith(domain1);
}

function prepareListContents(
    items: Array<IntermediateEntry>,
    domains: Array<string>,
    searchTerm: string
): Array<VaultContentsItemDisplay> {
    const results = items.map(item => ({
        title: item.title,
        subtitle: item.username,
        icon: "file-outline",
        sourceItem: item
    }));
    return searchTerm.length > 0
        ? termMatchEntries(results, searchTerm)
        : domainMatchEntries(results, domains);
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

function renderItemIcon(props, icon: string) {
    return (
        <Icon {...props} name={icon} />
    );
}

function termMatchEntries(items: Array<VaultContentsItemDisplay>, term: string): Array<VaultContentsItemDisplay> {
    const preparedTerm = term.toLowerCase();
    return items.filter(item => `${item.title} ${item.subtitle}`.toLowerCase().indexOf(preparedTerm) >= 0);
}

export function AutofillItemsScreen({ navigation }) {
    const [currentSource] = useSingleState(VAULT, "currentSource");
    const [autofillEntries] = useSingleState(AUTOFILL, "entries");
    const loginItems = autofillEntries[currentSource] as Array<IntermediateEntry>;
    const [searchTerm, setSearchTerm] = useState("");
    const [nextTerm, setNextTerm] = useState("");
    const {
        autofillURLs
    } = useContext(AutofillContext);
    const autofillDomains = useMemo(() => autofillURLs.map(url => extractDomain(url)), [autofillURLs]);
    const preparedContents = useMemo(() => prepareListContents(loginItems, autofillDomains, searchTerm), [autofillDomains, loginItems, searchTerm]);
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
            <SearchBar onTermChange={setNextTerm} onTermUpdate={setSearchTerm} />
            {(searchTerm !== nextTerm) && (
                <Layout level="2" style={styles.spinnerContainer}>
                    <Spinner status="info" size="giant" />
                </Layout>
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
