import React, { useCallback, useContext, useMemo } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Clipboard from "@react-native-community/clipboard";
import { Card, Layout, List, Text } from "@ui-kitten/components";
import { HomeTopBar } from "../menus/HomeTopBar";
import { EmptyState } from "../EmptyState";
import { ErrorBoundary } from "../ErrorBoundary";
import { CodeDigits } from "./codes/CodeDigits";
import { CodeWheel } from "./codes/CodeWheel";
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

const renderHeader = (props, info: { item: OTPCode }) => (
    <View {...props}>
        {(info.item.entryTitle || info.item.otpIssuer) && (
            <>
                <Text category='s1'>{info.item.entryTitle || info.item.otpIssuer}</Text>
                <Text category='s2'>{info.item.otpTitle}</Text>
            </>
        ) || (
            <Text category='s1'>{info.item.otpTitle}</Text>
        )}
    </View>
);

function renderItem(info: { item: OTPCode }, onCodePress: (item: OTPCode) => void) {
    return (
        <View style={{ flex: 1, marginTop: 5, marginBottom: 5 }}>
            <Card
                footer={props => renderHeader(props, info)}
                onPress={() => onCodePress(info.item)}
                style={styles.card}
            >
                <View style={styles.cardContentMain}>
                    <CodeDigits code={info.item.currentCode} />
                    <CodeWheel period={info.item.period} timeLeft={info.item.timeLeft} />
                </View>
            </Card>
        </View>
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
    const renderWrapper = useMemo(() =>
        info => renderItem(info, handleItemPress),
        []
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
