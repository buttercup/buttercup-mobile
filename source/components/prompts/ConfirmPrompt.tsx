import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Modal, Text } from "@ui-kitten/components";

interface TextPromptProps {
    cancelable?: boolean;
    cancelText?: string;
    confirmText?: string;
    onCancel?: () => void;
    onConfirm: () => void;
    prompt: string;
    title: string;
    visible: boolean;
}

const NOOP = () => {};

const styles = StyleSheet.create({
    cancelButton: {
        marginTop: 6
    },
    card: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch"
    },
    footerLayout: {},
    headerLayout: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    input: {
        width: 200
    },
    titleText: {
        marginTop: 12
    }
});

export function ConfirmPrompt(props: TextPromptProps) {
    const {
        cancelable = false,
        cancelText = "Cancel",
        confirmText = "Confirm",
        onCancel = NOOP,
        onConfirm,
        prompt,
        title,
        visible
    } = props;
    const handleBackdropPress = useCallback(() => {
        if (cancelable) {
            onCancel();
        }
    }, [cancelable, onCancel]);
    const handleSubmission = useCallback(() => {
        onConfirm();
    }, [onConfirm]);
    const renderHeader = useCallback(
        props => (
            <View {...props} style={[props.style, styles.headerLayout]}>
                <Text category="s1" style={styles.titleText}>
                    {title}
                </Text>
            </View>
        ),
        [title]
    );
    const renderFooter = useCallback(
        props => (
            <View {...props} style={[props.style, styles.footerLayout]}>
                <Button onPress={handleSubmission} status="success">
                    {confirmText}
                </Button>
                <Button
                    appearance="ghost"
                    disabled={!cancelable}
                    onPress={onCancel}
                    size="small"
                    status="basic"
                    style={styles.cancelButton}
                >
                    {cancelText}
                </Button>
            </View>
        ),
        [cancelable, cancelText, confirmText, handleSubmission, onCancel, onConfirm, prompt]
    );
    return (
        <Modal
            backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            onBackdropPress={handleBackdropPress}
            visible={visible}
        >
            <Card disabled footer={renderFooter} header={renderHeader} style={styles.card}>
                <Text>{prompt}</Text>
            </Card>
        </Modal>
    );
}
