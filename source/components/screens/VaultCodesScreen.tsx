import React, { useCallback, useContext, useMemo } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Clipboard from "@react-native-community/clipboard";
import { Layout, List, Text } from "@ui-kitten/components";
import { EmptyState } from "../EmptyState";
import { ErrorBoundary } from "../ErrorBoundary";
import { Code } from "./codes/Code";
import { notifySuccess } from "../../library/notifications";
import { useTabFocusState } from "../../hooks/vaultTab";
import { OTPContext } from "../../contexts/otp";
import { OTPCode } from "../../types";

const styles = StyleSheet.create({
    listContainer: {},
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
    },
    noCodesLayout: {
        height: "100%"
    }
});

const renderHeader = (props, info: { item: OTPCode }) => (
    <View {...props}>
        <Text category='s1'>{info.item.entryTitle}</Text>
        <Text category='s2'>{info.item.otpTitle}</Text>
    </View>
);

function renderItem(info: { item: OTPCode }, onCodePress: (item: OTPCode) => void, isLast: boolean) {
    return (
        <Code code={info.item} last={isLast} onPress={onCodePress} />
    );
}

export function VaultCodesScreen() {
    useTabFocusState("codes", "Codes");
    const {
        currentSourceOTPCodes
    } = useContext(OTPContext);
    const handleItemPress = useCallback((code: OTPCode) => {
        Clipboard.setString(code.currentCode);
        notifySuccess("Code Copied", `'${code.otpTitle}' code was copied`);
    }, []);
    const otpCount = useMemo(() => currentSourceOTPCodes.length, [currentSourceOTPCodes]);
    const renderWrapper = useMemo(() =>
        info => renderItem(info, handleItemPress, info.index === (otpCount - 1)),
        [otpCount]
    );
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout style={{ flex: 1 }}>
                <ErrorBoundary>
                    {currentSourceOTPCodes.length > 0 && (
                        <List
                            style={styles.listContainer}
                            contentContainerStyle={styles.contentContainer}
                            data={currentSourceOTPCodes}
                            renderItem={renderWrapper}
                        />
                    )}
                    {currentSourceOTPCodes.length === 0 && (
                        <Layout level="2" style={styles.noCodesLayout}>
                            <EmptyState
                                title="No OTP Codes"
                                description="No codes were found in this vault."
                                icon="keypad-outline"
                            />
                        </Layout>
                    )}
                </ErrorBoundary>
            </Layout>
        </SafeAreaView>
    );
}
