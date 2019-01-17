import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    image: {
        color: "#454545"
    }
});

export default function ToolbarButton({ title, onPress }) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}
