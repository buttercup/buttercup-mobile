import React, { useCallback } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Layout, ListItem, Text } from "@ui-kitten/components";
import { VaultContentsList } from "./vault-contents/VaultContentsList";
import { SearchBar } from "./search/SearchBar";
import { useTabFocusState } from "../../hooks/vaultTab";

const styles = StyleSheet.create({

});

export function SearchScreen({ navigation }) {
    useTabFocusState("search", "Search");
    const handleSearchTermUpdate = useCallback((term: string) => {

    }, []);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <SearchBar
                onTermUpdate={handleSearchTermUpdate}
            />
            <Layout style={{ flex: 1 }}>
                <VaultContentsList
                    contents={[]}
                    navigation={navigation}
                />
            </Layout>
        </SafeAreaView>
    );
}
