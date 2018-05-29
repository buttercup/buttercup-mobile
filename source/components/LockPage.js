import React, { Component } from "react";
import { Image, StyleSheet, View } from "react-native";

const LOGO = require("../../resources/images/solo-logo.png");

const styles = StyleSheet.create({
    container: {
        top: 0,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#24B5AB"
    }
});

class LockedModal extends Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style={styles.container}>
                <Image source={LOGO} />
            </View>
        );
    }
}

export default LockedModal;
