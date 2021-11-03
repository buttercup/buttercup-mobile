import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
    Layout,
    Text
} from "@ui-kitten/components";
import { EntryPropertyValueType } from "buttercup";
import { CodeDigits } from "../codes/CodeDigits";
import { CodeWheel } from "../codes/CodeWheel";
import { OTPCode } from "../../../types";

export interface FieldValueProps {
    info: VisibleField;
    otp?: OTPCode;
}

export interface VisibleField {
    key: string;
    property: string;
    removeable: boolean;
    title: string;
    value: string;
    valueType: EntryPropertyValueType;
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
    fieldValueLayout: {
        marginRight: 0,
        marginLeft: "auto"
    },
    fieldValueLayoutNote: {
        padding: 4,
        width: "100%"
    },
    otpCode: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10
    },
    otpSpacer: {
        height: 1,
        width: 22
    },
    passwordValue: {
        fontFamily: MONO_FONT,
        fontSize: 16,
        fontWeight: "600"
    },
    textValue: {
        fontSize: 16
    }
});

export function EntryFieldValue(props: FieldValueProps) {
    const { info, otp } = props;
    if (info.valueType === EntryPropertyValueType.Note) {
        return (
            <Layout level="2" style={styles.fieldValueLayoutNote}>
                <Text
                    numberOfLines={0}
                    style={styles.textValue}
                >
                    {info.value}
                </Text>
            </Layout>
        );
    }
    return (
        <Layout style={styles.fieldValueLayout}>
            {info.valueType === EntryPropertyValueType.OTP && (
                <>
                    {otp && (
                        <Layout style={styles.otpCode}>
                            <CodeDigits code={otp.currentCode} />
                            <View style={styles.otpSpacer} />
                            <CodeWheel
                                period={otp.period}
                                timeLeft={otp.timeLeft}
                            />
                        </Layout>
                    )}
                    {!otp && (
                        <CodeDigits code="ERROR" />
                    )}
                </>
            )}
            {info.valueType === EntryPropertyValueType.Password && (
                <Text
                    numberOfLines={1}
                    style={styles.passwordValue}
                >
                    {info.value}
                </Text>
            )}
            {info.valueType === EntryPropertyValueType.Text && (
                <Text
                    category="p1"
                    dataDetectorType="all"
                    numberOfLines={1}
                    style={styles.textValue}
                >
                    {info.value}
                </Text>
            )}
        </Layout>
    );
}
