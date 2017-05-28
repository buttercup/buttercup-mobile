import React, { Component } from "react";
import {
  StyleSheet,
  View
} from "react-native";
import {
    Button,
    FormInput,
    FormLabel,
    Text
} from "react-native-elements";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "transparent"
    },
    connectButton: {
        backgroundColor: "rgb(0, 183, 172)",
        marginTop: 15
    }
});

class ArchiveSourceForm extends Component {

    render() {
        switch (this.props.archiveType) {
            case "webdav":
                return this.renderWebDAV();

            default:
                throw new Error(`Unknown type: ${this.props.archiveType}`);
        }
    }

    renderWebDAV() {
        return (
            <View style={styles.container}>
                <Text h3>WebDAV</Text>
                <View>
                    <FormLabel>Remote URL</FormLabel>
                    <FormInput />
                    <FormLabel>Username</FormLabel>
                    <FormInput />
                    <FormLabel>Password</FormLabel>
                    <FormInput />
                    <Button
                        buttonStyle={styles.connectButton}
                        large
                        icon={{ name: "cloud" }}
                        title="Connect"
                        />
                </View>
            </View>
        );
    }

}

ArchiveSourceForm.propTypes = {
    archiveType:            PropTypes.string
};

export default ArchiveSourceForm;
