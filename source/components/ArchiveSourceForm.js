import React, { Component } from "react";
import {
    Keyboard,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {
    Button,
    FormInput,
    FormLabel,
    Text
} from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text h3>WebDAV</Text>
                    <View>
                        <FormLabel>Remote URL</FormLabel>
                        <FormInput value={this.props.url} onChangeText={this.props.onChangeURL} />
                        <FormLabel>Username</FormLabel>
                        <FormInput value={this.props.username} onChangeText={this.props.onChangeUsername} />
                        <FormLabel>Password</FormLabel>
                        <FormInput value={this.props.password} onChangeText={this.props.onChangePassword} />
                        <Button
                            buttonStyle={styles.connectButton}
                            large
                            icon={{ name: "cloud" }}
                            title="Connect"
                            onPress={() => this.submit()}
                            />
                    </View>
                    <Spinner
                        visible={this.props.connecting}
                        textContent="Connecting"
                        textStyle={{ color: "#FFF" }}
                        overlayColor="rgba(0, 0, 0, 0.75)"
                        />
                </View>
            </TouchableWithoutFeedback>
        );
    }

    submit() {
        Keyboard.dismiss();
        this.props.onConnectPressed();
        this.props.initiateConnection();
    }

}

ArchiveSourceForm.propTypes = {
    archiveType:            PropTypes.string,
    connecting:             PropTypes.bool,
    initiateConnection:     PropTypes.func,
    onChangePassword:       PropTypes.func,
    onChangeURL:            PropTypes.func,
    onChangeUsername:       PropTypes.func,
    onConnectPressed:       PropTypes.func,
    password:               PropTypes.string,
    url:                    PropTypes.string,
    username:               PropTypes.string
};

export default ArchiveSourceForm;
