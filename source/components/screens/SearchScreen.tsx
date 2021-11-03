import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Layout, Spinner } from "@ui-kitten/components";
import { useState as useHookState } from "@hookstate/core";
import { VaultContentsList } from "./vault-contents/VaultContentsList";
import { SearchBar } from "./search/SearchBar";
import { useTabFocusState } from "../../hooks/vaultTab";
import { SearchResult, searchSingleVault } from "../../services/search";
import { CURRENT_SOURCE } from "../../state/vault";
import { notifyError } from "../../library/notifications";
import { VaultContentsItem } from "../../types";

const styles = StyleSheet.create({
    spinnerContainer: {
        flexGrow: 0,
        flexShrink: 1,
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 18
    }
});

export function SearchScreen({ navigation }) {
    useTabFocusState("search", "Search");
    const currentSourceState = useHookState(CURRENT_SOURCE);
    const [searchTerm, setSearchTerm] = useState("");
    const [nextTerm, setNextTerm] = useState("");
    const [searching, setSearching] = useState(false);
    const [currentSearchTerm, setCurrentSearchTerm] = useState("");
    const [results, setResults] = useState<Array<VaultContentsItem>>([]);
    useEffect(() => {
        if (searching) return;
        if (currentSearchTerm === searchTerm) return;
        setSearching(true);
        searchSingleVault(currentSourceState.get(), searchTerm)
            .then((newResults: Array<SearchResult>) => {
                setResults(newResults.map(res => ({
                    id: res.id,
                    title: res.properties.title,
                    type: "entry",
                    groupID: res.groupID
                })));
                setCurrentSearchTerm(searchTerm);
                setSearching(false);
            })
            .catch(err => {
                console.error(err);
                setSearching(false);
                notifyError("Search failed", err.message);
            });
    }, [searchTerm, currentSearchTerm, searching, currentSourceState]);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <SearchBar
                onTermChange={setNextTerm}
                onTermUpdate={setSearchTerm}
            />
            {(currentSearchTerm !== nextTerm) && (
                <Layout level="2" style={styles.spinnerContainer}>
                    <Spinner status="info" size="giant" />
                </Layout>
            )}
            <Layout style={{ flex: 1 }}>
                <VaultContentsList
                    contents={results}
                    navigation={navigation}
                />
            </Layout>
        </SafeAreaView>
    );
}
