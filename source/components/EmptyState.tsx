import React, { useCallback } from "react";
import { View } from "react-native";
import { Button, Icon, StyleService, Text, useStyleSheet } from "@ui-kitten/components";

interface EmptyStateProps {
    actionText?: string;
    description: string;
    icon?: string;
    onActionPress?: () => void;
    title: string;
}

const themedStyles = StyleService.create({
    button: {
        marginTop: 8
    },
    container: {
        width: "100%",
        paddingVertical: 32,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    description: {
        color: "color-basic-transparent-600",
        marginTop: 6
    },
    icon: {
        color: "color-basic-transparent-600",
        width: 40,
        height: 40,
        marginBottom: 16
    },
    title: {
        color: "color-basic-transparent-600"
    }
});

export function EmptyState(props: EmptyStateProps) {
    const {
        actionText,
        description,
        icon,
        onActionPress,
        title
    } = props;
    const styles = useStyleSheet(themedStyles);
    const iconColour = (styles.icon as any).color;
    const handleActionPress = useCallback(() => {
        // @todo Setup action
    }, [onActionPress]);
    return (
        <View style={styles.container}>
            {icon && (
                <Icon name={icon} fill={iconColour} style={styles.icon} />
            )}
            <Text category="h6" style={styles.title}>{title}</Text>
            <Text category="p1" style={styles.description}>{description}</Text>
            {actionText && onActionPress && (
                <Button
                    onPress={handleActionPress}
                    style={styles.button}
                >
                    {actionText}
                </Button>
            )}
        </View>
    );
}
