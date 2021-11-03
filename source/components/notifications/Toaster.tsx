import React, { useMemo } from "react";
import Toast, { BaseToast } from "react-native-toast-message";
import { StyleService, useStyleSheet } from "@ui-kitten/components";

const themedStyles = StyleService.create({
    containerError: {
        borderLeftColor: "color-danger-active-border",
        backgroundColor: "color-danger-default"
    },
    containerSuccess: {
        borderLeftColor: "color-success-focus-border",
        backgroundColor: "color-success-default"
    },
    contentContainer: {
        paddingHorizontal: 15
    },
    text1: {
        fontSize: 14,
        color: "color-basic-1000"
    },
    text2: {
        fontSize: 12,
        color: "color-basic-700"
    }
});

export function Toaster() {
    const styles = useStyleSheet(themedStyles);
    const config = useMemo(() => ({
        error: ({ text1, text2, ...rest }) => (
            <BaseToast
                {...rest}
                style={styles.containerError}
                contentContainerStyle={styles.contentContainer}
                text1NumberOfLines={1}
                text2NumberOfLines={2}
                text1Style={styles.text1}
                text2Style={styles.text2}
                text1={text1}
                text2={text2}
            />
        ),
        success: ({ text1, text2, ...rest }) => (
            <BaseToast
                {...rest}
                style={styles.containerSuccess}
                contentContainerStyle={styles.contentContainer}
                text1NumberOfLines={1}
                text2NumberOfLines={1}
                text1Style={styles.text1}
                text2Style={styles.text2}
                text1={text1}
                text2={text2}
            />
        )
    }), [styles]);
    return (
        <>
            <Toast
                config={config}
                ref={ref => Toast.setRef(ref)}
            />
        </>
    );
}
