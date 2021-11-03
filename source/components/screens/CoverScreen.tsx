import React from "react";
import { Image, SafeAreaView, StyleSheet } from "react-native";
import { Layout } from "@ui-kitten/components";

const BCUP_LOGO = require("../../../resources/images/bcup-256.png");

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: 150,
        height: 150
    }
});

export function CoverScreen() {
    return (
        <SafeAreaView>
            <Layout style={styles.container}>
                <Image source={BCUP_LOGO} style={styles.image} />
            </Layout>
        </SafeAreaView>
    );
}
