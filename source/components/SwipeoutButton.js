import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";

const ROOT_STYLES = {
    width: "100%",
    height: "100%",
    flex: 0,
    justifyContent: "center",
    alignItems: "center"
};

const styles = StyleSheet.create({
    text: {
        width: "90%",
        height: 14,
        fontSize: 14,
        lineHeight: 14,
        textAlign: "center",
        color: "#FFF"
    }
});

class SwipeoutButton extends Component {

    render() {
        const extraStyles = {
            backgroundColor: "red"
        };
        return (
            <View style={{ ...ROOT_STYLES, ...extraStyles }}>
                <Text style={styles.text}>{this.props.children}</Text>
            </View>
        );
    }

}

export default SwipeoutButton;
