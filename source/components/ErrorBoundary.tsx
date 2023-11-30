import React, { Component } from "react";
import { Platform, StyleSheet } from "react-native";
import { Card, Text } from "@ui-kitten/components";

const { MONO_FONT } = Platform.select({
    ios: {
        MONO_FONT: "Courier New"
    },
    android: {
        MONO_FONT: "monospace"
    }
});

const styles = StyleSheet.create({
    card: {
        margin: 8
    },
    errorStack: {
        fontFamily: MONO_FONT,
        fontSize: 12,
        marginTop: 10
    },
    errorTitle: {
        fontFamily: MONO_FONT,
        fontSize: 15,
        marginTop: 10
    }
});

function stripBlanks(txt = "") {
    return txt
        .split(/(\r\n|\n)/g)
        .filter(ln => ln.trim().length > 0)
        .join("\n");
}

export class ErrorBoundary extends Component {
    static getDerivedStateFromError(error) {
        return { error };
    }

    state = {
        error: null,
        errorStack: null
    };

    componentDidCatch(error, errorInfo) {
        this.setState({ errorStack: errorInfo.componentStack || null });
    }

    render() {
        if (!this.state.error) {
            return this.props.children;
        }
        return (
            <Card style={styles.card}>
                <Text category="h5">Application Error</Text>
                <Text category="s1" style={styles.errorTitle}>
                    {this.state.error.toString()}
                </Text>
                {this.state.errorStack && (
                    <Text style={styles.errorStack}>{stripBlanks(this.state.errorStack)}</Text>
                )}
            </Card>
        );
    }
}
