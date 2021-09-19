import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
    Button,
    Card,
    Input,
    Modal,
    Text
} from "@ui-kitten/components";
import { useKeyboardSize } from "../../hooks/keyboard";

interface TextPromptProps {
    cancelable?: boolean;
    cancelText?: string;
    onCancel?: () => void;
    onSubmit: (value: string) => void;
    password?: boolean;
    placeholder?: string;
    prompt: string;
    submitText?: string;
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
    promptText: {
        marginTop: 12
    }
});

function ModalContent(props: TextPromptProps) {
    const {
        cancelable = false,
        cancelText = "Cancel",
        onCancel = NOOP,
        onSubmit,
        password = false,
        placeholder = "",
        prompt,
        submitText = "Submit"
    } = props;
    const [value, setValue] = useState("");
    const keyboardSize = useKeyboardSize();
    const handleSubmission = useCallback(() => {
        onSubmit(value);
        setValue("");
    }, [onSubmit, value]);
    const renderHeader = useCallback((props) => (
        <View {...props} style={[props.style, styles.headerLayout]}>
            <Text category="s1" style={styles.promptText}>{prompt}</Text>
        </View>
    ), [prompt]);
    const renderFooter = useCallback((props) => (
        <View {...props} style={[props.style, styles.footerLayout]}>
            <Button
                disabled={value.trim().length <= 0}
                onPress={handleSubmission}
                status="success"
            >
                {submitText}
            </Button>
            {cancelable && (<Button
                appearance="ghost"
                onPress={onCancel}
                size="small"
                status="basic"
                style={styles.cancelButton}
            >
                {cancelText}
            </Button>)}
        </View>
    ), [cancelable, cancelText, handleSubmission, onCancel, onSubmit, prompt, submitText, value]);
    return (
        <Card
            disabled
            footer={renderFooter}
            header={renderHeader}
            style={[
                styles.card,
                {
                    marginBottom: keyboardSize
                }
            ]}
        >
            <Input
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                autoFocus
                onChangeText={setValue}
                placeholder={placeholder}
                secureTextEntry={password}
                style={styles.input}
                value={value}
            />
        </Card>
    );
}

export function TextPrompt(props: TextPromptProps) {
    const {
        cancelable = false,
        onCancel = NOOP,
        visible
    } = props;
    const handleBackdropPress = useCallback(() => {
        if (cancelable) {
            onCancel();
        }
    }, [cancelable, onCancel]);
    return (
        <Modal
            backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            onBackdropPress={handleBackdropPress}
            visible={visible}
        >
            <ModalContent {...props} />
        </Modal>
    );
}
