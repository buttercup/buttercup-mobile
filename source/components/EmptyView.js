import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View
} from "react-native";

const styles = StyleSheet.create({
    emptyView: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%"
    },
    emptyViewText: {
        marginTop: 20,
        opacity: 0.7
    }
});

export default function EmptyView({ text, imageSource }) {
    return (
        <View style={styles.emptyView}>
            <Image
                source={imageSource}
                />
            <Text style={styles.emptyViewText}>{text}</Text>
        </View>
    );
}
