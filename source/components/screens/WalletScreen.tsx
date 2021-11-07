import React, { useMemo } from "react";
import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";
import { Layout, List, Text } from "@ui-kitten/components";
import { CardView } from "react-native-credit-card-input";
import { useState as useHookState } from "@hookstate/core";
import validateCard from "card-validator";
import { Entry } from "buttercup";
import { EmptyState } from "../EmptyState";
import { CURRENT_SOURCE } from "../../state/vault";
import { useTabFocusState } from "../../hooks/vaultTab";
import { useVaultWalletEntries } from "../../hooks/buttercup";

interface CardInfo {
    card: {
        gaps?: Array<number>;
        niceType?: string;
        type: string | null;
    };
    isPotentiallyValid: boolean;
    isValid: boolean;
}

interface ItemInfo {
    item: Entry;
}

const CARD_SCALE_WIDTH_BASE = 300;

const styles = StyleSheet.create({
    cardTitle: {
        borderBottomColor: "#bbb",
        borderBottomWidth: 1,
        width: "100%"
    },
    listContainer: {},
    contentContainer: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    item: {
      marginVertical: 4,
    },
    noCardsLayout: {
        height: "100%"
    },
    outerContainer: {
        marginTop: 10,
        marginBottom: 10
    }
});

function formatCardDate(date: string): string {
    if (/^\d{2}\//.test(date)) return date;
    if (date.length === 4) {
        return `${date.substring(0, 2)}/${date.substring(2)}`;
    } else if (date.length === 6) {
        return `${date.substring(0, 2)}/${date.substring(4)}`;
    }
    return "";
}

function renderItem(info: ItemInfo, cardInfo: CardInfo, screenWidth: number) {
    const {
        cvv = "",
        expiry,
        password,
        title,
        username,
    } = info.item.getProperties();
    return (
        <View style={styles.outerContainer}>
            <Text category="s1" style={styles.cardTitle}>{title}</Text>
            <View style={{ flex: 1, marginLeft: "auto", marginRight: "auto" }}>
                <CardView
                    cvc={cvv}
                    name={username}
                    number={password}
                    expiry={formatCardDate(expiry)}
                    brand={cardInfo.card?.type ?? "placeholder"}
                    scale={(screenWidth - 45) / CARD_SCALE_WIDTH_BASE}
                />
            </View>
        </View>
    );
}

export function WalletScreen() {
    useTabFocusState("wallet", "Wallet");
    const currentSourceState = useHookState(CURRENT_SOURCE);
    const entries = useVaultWalletEntries(currentSourceState.get());
    const screenWidth = useMemo(() => Dimensions.get("window").width, []);
    const renderWrapper = useMemo(() =>
        (info: ItemInfo) => renderItem(info, validateCard.number(info.item.getProperty("password")), screenWidth),
        [screenWidth]
    );
    return (
        <SafeAreaView style={{ flex: 1, flexDirection: "row" }}>
            <Layout style={{ flex: 1, alignItems: "stretch" }}>
                {entries.length > 0 && (
                    <List
                        style={styles.listContainer}
                        contentContainerStyle={styles.contentContainer}
                        data={entries}
                        renderItem={renderWrapper}
                    />
                )}
                {entries.length === 0 && (
                    <Layout level="2" style={styles.noCardsLayout}>
                        <EmptyState
                            title="No Cards"
                            description="No cards were found in this vault."
                            icon="credit-card-outline"
                        />
                    </Layout>
                )}
            </Layout>
        </SafeAreaView>
    );
}
