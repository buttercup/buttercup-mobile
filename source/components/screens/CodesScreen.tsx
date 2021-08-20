import React, { useCallback, useMemo } from "react";
import { Dimensions, Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { Card, Divider, Layout, List, Spinner, Text } from "@ui-kitten/components";
import AnimatedProgressWheel from "react-native-progress-wheel";

const CARD_SCALE_WIDTH_BASE = 300;

const { MONO_FONT } = Platform.select({
    ios: {
        MONO_FONT: "Courier New"
    },
    android: {
        MONO_FONT: "monospace"
    }
});

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
    },
    cardContentMain: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
});

const renderHeader = (props, info) => (
    <View {...props}>
        <Text category='s1'>{info.item.title}</Text>
        <Text category='s2'>{info.item.subtitle}</Text>
    </View>
);

const data = new Array(8).fill({
    title: "Some Code",
    subtitle: "Perry's website login",
    code: "873 230",
    time: 3,
    timeMax: 30
});

function codeColour(percent: number): string {
    if (percent < 20) {
        return "#fb6962";
    } else if (percent < 40) {
        return "#fcfc99";
    }
    return "#79de79";
}

function renderItem(info) {
    const percent = (info.item.time / info.item.timeMax) * 100;
    return (
        <View style={{ flex: 1, marginTop: 5, marginBottom: 5 }}>
            <Card
                style={styles.card}
                footer={props => renderHeader(props, info)}
            >
                <View style={styles.cardContentMain}>
                    <Text category="h1" style={{ fontFamily: MONO_FONT }}>{info.item.code}</Text>
                    <AnimatedProgressWheel
                        size={40}
                        width={5}
                        color={codeColour(percent)}
                        progress={percent}
                        backgroundColor={'grey'}
                    />
                </View>
            </Card>
        </View>
    );
}

export function CodesScreen() {
    const renderWrapper = useMemo(() =>
        renderItem,
        []
    );
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout style={{ flex: 1 }}>
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
