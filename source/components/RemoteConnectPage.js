import React, { Component } from "react";
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Cell, CellGroup, CellInput } from "react-native-cell-components";
import Spinner from "react-native-loading-spinner-overlay";
import Notification from "react-native-notification";
import PropTypes from "prop-types";
import DropboxAuthButton from "../containers/DropboxAuthButton.js";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "transparent",
        width: "100%"
    },
    connectButton: {
        backgroundColor: "rgb(0, 183, 172)",
        marginTop: 15
    }
});

class RemoteConnectPage extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: `${params.title}`
        };
    };

    componentWillUnmount() {
        this.props.onUnmount();
    }

    render() {
        switch (this.props.archiveType) {
            case "dropbox":
                return this.renderDropbox();
            case "webdav":
                return this.renderWebDAV();
            case "owncloud":
                return this.renderWebDAV();
            case "nextcloud":
                return this.renderWebDAV();

            default:
                throw new Error(`Unknown type: ${this.props.archiveType}`);
        }
    }

    renderDropbox() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View>
                        <DropboxAuthButton />
                        <CellGroup>
                            <Cell
                                title="Connect"
                                icon="cloud"
                                onPress={() => this.submit()}
                                tintColor="#1144FF"
                                disabled={!this.props.dropboxAuthenticated}
                            />
                        </CellGroup>
                    </View>
                    <Notification message={this.props.dropboxAuthMessage} />
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

    renderWebDAV() {
        const base = { autoCapitalize: "none", autoCorrect: false, keyboardType: "default", spellCheck: false };
        const urlInputOptions = { ...base, keyboardType: "url" };
        const usernameInputOptions = { ...base, keyboardType: "email-address" };
        const passwordInputOptions = { ...base, secureTextEntry: true };
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <CellGroup header="Connection details">
                        <CellInput
                            title="Remote URL"
                            value={this.props.url}
                            icon="laptop"
                            onChangeText={newText => this.props.onChangeURL(newText)}
                            {...urlInputOptions}
                        />
                        <CellInput
                            title="Username"
                            value={this.props.username}
                            icon="face"
                            onChangeText={newText => this.props.onChangeUsername(newText)}
                            {...usernameInputOptions}
                        />
                        <CellInput
                            title="Password"
                            value={this.props.password}
                            icon="fingerprint"
                            onChangeText={newText => this.props.onChangePassword(newText)}
                            {...passwordInputOptions}
                        />
                    </CellGroup>
                    <CellGroup>
                        <Cell title="Connect" icon="cloud" onPress={() => this.submit()} tintColor="#1144FF" />
                    </CellGroup>
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

RemoteConnectPage.propTypes = {
    archiveType: PropTypes.string,
    connecting: PropTypes.bool,
    dropboxAuthenticated: PropTypes.bool,
    dropboxAuthMessage: PropTypes.string,
    initiateConnection: PropTypes.func,
    onChangePassword: PropTypes.func,
    onChangeURL: PropTypes.func,
    onChangeUsername: PropTypes.func,
    onConnectPressed: PropTypes.func,
    password: PropTypes.string,
    url: PropTypes.string,
    username: PropTypes.string
};

RemoteConnectPage.defaultProps = {
    dropboxAuthenticated: false
};

export default RemoteConnectPage;
