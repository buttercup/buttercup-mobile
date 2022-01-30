import React from "react";
import { StyleService, Text, useStyleSheet } from "@ui-kitten/components";
import { View } from "react-native";

const themedStyles = StyleService.create({
    barContainer: {
        backgroundColor: "color-warning-default",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        color: "color-basic-default",
        paddingVertical: 4
    }
});

export function ReadOnlyBar() {
    const styles = useStyleSheet(themedStyles);
    return (
        <View style={styles.barContainer}>
            <Text category="s2" style={styles.text}>
                Read-Only
            </Text>
        </View>
    );
}
