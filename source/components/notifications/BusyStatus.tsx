import React from "react";
import { StyleSheet } from "react-native";
import { Card, Layout, Modal, Spinner, Text } from "@ui-kitten/components";
import { useBusyState } from "../../hooks/busyState";

const NOOP = () => {};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch"
    },
    spinnerContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    stateText: {
        marginTop: 12
    }
});

export function BusyStatus() {
    const busyState: string = useBusyState();
    if (!busyState) return null;
    return (
        <Modal
            visible={!!busyState}
            backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            onBackdropPress={NOOP}
        >
            <Card disabled style={styles.card}>
                <Layout style={styles.spinnerContainer}>
                    <Spinner size="giant" status="primary" />
                </Layout>
                <Text category="s1" style={styles.stateText}>
                    {busyState || ""}
                </Text>
            </Card>
        </Modal>
    );
}
