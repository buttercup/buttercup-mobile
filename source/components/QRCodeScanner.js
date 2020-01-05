import React from "react";
import PropTypes from "prop-types";
import {
    View,
    StyleSheet,
    Dimensions,
    Button,
    Text,
    TouchableOpacity,
    TouchableHighlight
} from "react-native";
import { HeaderButtons, Item } from "./HeaderButtons";
import { navigateBack } from "../shared/nav";
import QRCodeScanner from "react-native-qrcode-scanner";
import { isOTP } from "../library/otp";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    zeroContainer: {
        height: 0,
        flex: 0
    },
    cameraContainer: {},
    centerText: {
        fontSize: 18,
        padding: 32,
        color: "#777",
        textAlign: "center"
    },
    textBold: {
        fontWeight: "500",
        color: "#000"
    },
    buttonText: {
        fontSize: 21,
        color: "rgb(0,122,255)"
    },
    buttonTouchable: {
        padding: 16
    }
});

const QRCodeScannerPage = ({ onOTPUrlDiscovered }) => {
    const onSuccess = e => {
        if (isOTP(e.data)) {
            onOTPUrlDiscovered(e.data);
        }
    };
    return (
        <View style={styles.container}>
            <QRCodeScanner
                topViewStyle={styles.zeroContainer}
                cameraStyle={styles.cameraContainer}
                bottomContent={
                    <Text style={styles.centerText}>
                        Point your camera at a <Text style={styles.textBold}>QR Code</Text> to add
                        it to your vault.
                    </Text>
                }
                onRead={onSuccess}
            />
        </View>
    );
};

QRCodeScannerPage.propTypes = {
    onOTPUrlDiscovered: PropTypes.func.isRequired
};

QRCodeScannerPage.navigationOptions = ({ navigation }) => ({
    title: "Scan QR Code",
    headerRight: () => (
        <HeaderButtons>
            <Item title="dismiss" onPress={() => navigateBack()} />
        </HeaderButtons>
    )
});

export default QRCodeScannerPage;
