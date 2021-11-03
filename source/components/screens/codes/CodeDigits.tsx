import React from "react";
import { Platform } from "react-native";
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

export function CodeDigits(props: CodeDigitsProps) {
    let code = props.code;
    if (code.length === 6) {
        code = `${code.substring(0, 3)} ${code.substring(3)}`;
    } else if (code.length === 8) {
        code = `${code.substring(0, 4)} ${code.substring(4)}`;
    }
    return (
        <Text category="h1" style={{ fontFamily: MONO_FONT }}>{code}</Text>
    )
}
