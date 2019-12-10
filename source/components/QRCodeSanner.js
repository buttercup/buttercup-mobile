import React from "react";
import { View, StyleSheet } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

const QRCodeScannerPage = () => {
    const onSuccess = e => {
        console.log(e);
    };
    return (
        <View style={styles.container}>
            <QRCodeScanner onRead={onSuccess} />
        </View>
    );
};

export default QRCodeScannerPage;
