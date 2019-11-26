import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    image: {
        tintColor: "#454545"
    }
});

export default function ToolbarIcon({ icon, onPress, style = {} } = {}) {
    const containerStyle = StyleSheet.flatten([styles.container, style.container || {}]);
    const imageStyle = StyleSheet.flatten([styles.image, style.image || {}]);
    return (
        <TouchableOpacity style={containerStyle} onPress={onPress}>
            <Image style={imageStyle} source={icon} />
        </TouchableOpacity>
    );
}
