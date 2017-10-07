import React, { Component } from "react";
import {
    Image,
    StyleSheet,
    View
} from "react-native";

const LOCKED_BACKGROUND = require("../../resources/images/locked-image.jpg");

const styles = StyleSheet.create({
    container: {
        top: 0,
        flex: 1,
        alignItems: "stretch",
        backgroundColor: "#F00"
    },
    image: {
        flex: 1,
        width: "100%",
        height: "100%"
    }
});

class LockedModal extends Component {

    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.image}
                    source={LOCKED_BACKGROUND}
                    />
            </View>
        );
    }

}

export default LockedModal;
