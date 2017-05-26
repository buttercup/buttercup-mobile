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
        backgroundColor: 'transparent'
    }
});

class AddArchive extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>Add archive</Text>
            </View>
        );
    }

}

export default AddArchive;
