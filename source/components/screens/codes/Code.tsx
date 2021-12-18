import React, { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { Divider, Icon, StyleService, Text, useStyleSheet } from "@ui-kitten/components";
import { CodeDigits } from "./CodeDigits";
import { CodeWheel } from "./CodeWheel";
import { OTPCode } from "../../../types";

export interface OTPCodeProps {
    code: OTPCode;
    last?: boolean;
    onPress?: (item: OTPCode) => void;
}

const NOOP = () => {};

const themedStyles = StyleService.create({
    codeSpacer: {
        width: 16
    },
    contentView: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    digitsView: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    divider: {
        backgroundColor: "color-basic-800"
    },
    icon: {
        color: "color-basic-600",
        width: 25,
        height: 25
    },
    iconDefault: {
        flex: 0,
        width: 44,
        height: 44,
        borderRadius: 999,
        marginRight: 12,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "color-basic-700"
    },
    subtitle: {
        color: "color-basic-300",
        marginBottom: 4
    },
    title: {
        color: "color-basic-300"
    },
    titleOnly: {
        color: "color-basic-300",
        marginBottom: 4
    },
    view: {
        width: "100%",
        paddingTop: 8,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch"
    },
    viewInner: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingBottom: 6
    }
});

export function Code(props: OTPCodeProps) {
    const { code, last = false, onPress = NOOP } = props;
    const styles = useStyleSheet(themedStyles);
    const iconColour = (styles.icon as any).color;
    const handlePress = useCallback(() => {
        onPress(code);
    }, [code, onPress]);
    return (
        <View style={styles.view}>
            <TouchableOpacity onPress={handlePress} style={styles.viewInner}>
                <View style={styles.iconDefault}>
                    <Icon name="person-done" fill={iconColour} style={styles.icon} />
                </View>
                <View style={styles.contentView}>
                    {(code.entryTitle || code.otpIssuer) && (
                        <View>
                            <Text style={styles.title} category="s1">{code.entryTitle || code.otpIssuer}</Text>
                            <Text style={styles.subtitle} category="s2">{code.otpTitle}</Text>
                        </View>
                    ) || (
                        <View>
                            <Text style={styles.titleOnly} category="s1">{code.otpTitle}</Text>
                        </View>
                    )}
                    <View style={styles.digitsView}>
                        <CodeDigits code={code.currentCode} />
                        <View style={styles.codeSpacer} />
                        <CodeWheel period={code.period} timeLeft={code.timeLeft} />
                    </View>
                </View>
                {!last && (
                    <Divider style={styles.divider} />
                )}
            </TouchableOpacity>
            {!last && (
                <Divider style={styles.divider} />
            )}
        </View>
    );
}
