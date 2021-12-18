import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Text } from "@ui-kitten/components";

interface CodeDigitsProps {
    code: string;
}

const { MONO_FONT } = Platform.select({
    ios: {
        MONO_FONT: "Courier New"
    },
    android: {
        MONO_FONT: "monospace"
    }
});

const styles = StyleSheet.create({
    codeView: {
        display: "flex",
        flexDirection: "row"
    },
    text: {
        fontFamily: MONO_FONT,
        fontSize: 36
    },
    textLast: {
        marginLeft: 12
    }
});

export function CodeDigits(props: CodeDigitsProps) {
    let code = props.code,
        split: number = 100;
    if (code.length === 6) {
        split = 3;
    } else if (code.length === 8) {
        split = 4;
    }
    return (
        <View style={styles.codeView}>
            <Text category="h1" style={styles.text}>{code.substring(0, split)}</Text>
            <Text category="h1" style={[styles.text, styles.textLast]}>{code.substring(split)}</Text>
        </View>
    );
}
