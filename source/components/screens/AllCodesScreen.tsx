import React, { useCallback, useContext, useMemo } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import Clipboard from "@react-native-community/clipboard";
import { Layout, List } from "@ui-kitten/components";
import { HomeTopBar } from "../menus/HomeTopBar";
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
    },
    noIssuerText: {
        fontStyle: "italic"
    }
});

function renderItem(info: { item: OTPCode }, onCodePress: (item: OTPCode) => void, isLast: boolean) {
    return (
        <Code code={info.item} last={isLast} onPress={onCodePress} />
    );
}

export function AllCodesScreen({ navigation }) {
    useTabFocusState("codes", "Codes");
    const {
        allOTPCodes
    } = useContext(OTPContext);
    const handleItemPress = useCallback((code: OTPCode) => {
        Clipboard.setString(code.currentCode);
        notifySuccess("Code Copied", `'${code.otpTitle}' code was copied`);
    }, []);
    const otpCount = useMemo(() => allOTPCodes.length, [allOTPCodes]);
    const renderWrapper = useMemo(() =>
        info => renderItem(info, handleItemPress, info.index === (otpCount - 1)),
        [otpCount]
    );
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HomeTopBar navigation={navigation} />
            <Layout style={{ flex: 1 }}>
                <ErrorBoundary>
                    {allOTPCodes.length > 0 && (
                        <List
                            style={styles.listContainer}
                            contentContainerStyle={styles.contentContainer}
                            data={allOTPCodes}
                            renderItem={renderWrapper}
                        />
                    )}
                    {allOTPCodes.length === 0 && (
                        <Layout level="2" style={styles.noCodesLayout}>
                            <EmptyState
                                title="No OTP Codes"
                                description="No codes have been made available."
                                icon="keypad-outline"
                            />
                        </Layout>
                    )}
                </ErrorBoundary>
            </Layout>
        </SafeAreaView>
    );
}
