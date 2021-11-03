import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Icon, Input, Layout } from "@ui-kitten/components";

export interface SearchBarProps {
    debounceDelay?: number;
    onTermChange?: (term: string) => void;
    onTermUpdate: (term: string) => void;
}

const NOOP = () => {};

const styles = StyleSheet.create({
    input: {
        borderRadius: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        width: "100%"
    },
    layout: {
        flexGrow: 0,
        flexShrink: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "stretch",
        width: "100%"
    }
});

const SearchIcon = props => (
    <Icon {...props} name="search-outline" />
);

export function SearchBar(props: SearchBarProps) {
    const { debounceDelay = 450, onTermChange = NOOP, onTermUpdate } = props;
    const [term, setTerm] = useState("");
    useEffect(() => {
        onTermChange(term);
        const updateTimeout = setTimeout(() => {
            onTermUpdate(term);
        }, debounceDelay);
        return () => {
            clearTimeout(updateTimeout);
        };
    }, [debounceDelay, onTermChange, onTermUpdate, term]);
    return (
        <Layout style={styles.layout}>
            <Input
                accessoryRight={SearchIcon}
                onChangeText={value => setTerm(value)}
                placeholder="Search"
                style={styles.input}
                value={term}
            />
        </Layout>
    );
}
