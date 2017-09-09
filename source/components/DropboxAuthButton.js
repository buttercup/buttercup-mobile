import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";
import { Button } from "react-native-elements";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
    authButton: {
        backgroundColor: "rgb(0, 183, 172)"
    },
    disabledAuthButton: {
        backgroundColor: "rgb(189, 190, 191)"
    }
});

class DropboxAuthButton extends Component {

    beginAuthentication() {
        // openAuthPage();
        this.props.onClick();
    }

    render() {
        const title = this.props.authenticated ? "Authenticated" : "Authenticate";
        const iconName = this.props.authenticated ? "lock open" : "lock";
        return (
            <Button
                title={title}
                icon={{ name: iconName }}
                buttonStyle={styles.authButton}
                disabled={this.props.authenticating}
                disabledStyle={styles.disabledAuthButton}
                onPress={() => this.beginAuthentication()}
                />
        );
    }

}

DropboxAuthButton.propTypes = {
    authenticated:              PropTypes.bool.isRequired,
    authenticating:             PropTypes.bool.isRequired,
    onClick:                    PropTypes.func.isRequired
};

export default DropboxAuthButton;
