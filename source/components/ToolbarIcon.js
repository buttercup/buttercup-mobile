import React from 'react';
import {
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native";

const styles = StyleSheet.create({
    container: {
        paddingRight: 10
    },
    image: {
        tintColor: '#454545'
    }
});

export default function ToolbarIcon({ icon, onPress }) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image style={styles.image} source={icon} />
        </TouchableOpacity>
    );
}
