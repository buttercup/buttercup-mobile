import React, { useCallback, useMemo } from "react";
import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";
import { Divider, Layout, List, TopNavigation, Text } from "@ui-kitten/components";
import { CardView } from "react-native-credit-card-input";

const CARD_SCALE_WIDTH_BASE = 300;

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
});

const data = new Array(8).fill({
    title: 'Item',
});

function renderItem(info, screenWidth: number) {
    return (
        <View style={{ flex: 1, marginLeft: "auto", marginRight: "auto", marginTop: 10, marginBottom: 10 }}>
            <CardView
                name="Jane Doe"
                number="1234 5678 0000 0101"
                expiry="01/23"
                brand="visa"
                scale={(screenWidth - 45) / CARD_SCALE_WIDTH_BASE}
            />
        </View>
    );
}

export function WalletScreen() {
    const screenWidth = useMemo(() => Dimensions.get("window").width, []);
    const renderWrapper = useMemo(() =>
        info => renderItem(info, screenWidth),
        [screenWidth]
    );
    return (
        <SafeAreaView style={{ flex: 1, flexDirection: "row" }}>
            <Layout style={{ flex: 1, alignItems: "stretch" }}>
                <List
                    style={styles.listContainer}
                    contentContainerStyle={styles.contentContainer}
                    data={data}
                    renderItem={renderWrapper}
                />
            </Layout>
        </SafeAreaView>
    );
}
