import { Modal } from "@ui-kitten/components";
import { WebView } from "react-native-webview";
import { Platform, StyleSheet, View } from "react-native";

export interface OTPScannerModalProps {
    visible: boolean;
    onBackdropPress: () => void;
    onScan: (data: string) => void;
}

function getDeviceSource() {
    if (Platform.OS === "android") {
        return { uri: "file:///android_asset/OTPScanner.html" };
    }
    const template = require("../../../resources/html/OTPScanner.html");

    return template;
}

export function OTPScannerModal({ visible, onBackdropPress, onScan }: OTPScannerModalProps) {
    return (
        <Modal
            visible={visible}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => onBackdropPress()}
        >
            <View style={styles.container}>
                <WebView
                    mediaPlaybackRequiresUserAction={false}
                    mediaCapturePermissionGrantType="grant"
                    javaScriptEnabled={true}
                    originWhitelist={["*"]}
                    source={getDeviceSource()}
                    style={styles.webview}
                    allowsInlineMediaPlayback
                    onMessage={event => {
                        onScan(event.nativeEvent.data);
                    }}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        borderRadius: 15,
        overflow: "hidden",
        minHeight: 300,
        width: 300
    },
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    webview: {
        flex: 1
    }
});
