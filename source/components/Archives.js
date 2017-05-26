import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    }
});

class Archives extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>Buttercup home page</Text>
            </View>
        );
    }

}

export default Archives;
