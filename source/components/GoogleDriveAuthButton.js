import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import PropTypes from "prop-types";
import { Cell, CellGroup } from "@sallar/react-native-cell-components";

class GoogleDriveAuthButton extends Component {
    render() {
        const title = this.props.authenticated ? "Authenticated" : "Authenticate";
        return (
            <CellGroup>
                <Cell
                    title={title}
                    icon={{ name: "google-drive", source: "entypo" }}
                    onPress={() => this.props.onSignIn()}
                    tintColor="#1144FF"
                    disabled={this.props.authenticating || this.props.authenticated}
                />
                <Cell
                    title="Sign Out"
                    icon={{ name: "log-out", source: "entypo" }}
                    onPress={() => this.props.onSignOut()}
                    tintColor="#1144FF"
                    disabled={!this.props.authenticated}
                />
            </CellGroup>
        );
    }
}

GoogleDriveAuthButton.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authenticating: PropTypes.bool.isRequired,
    onSignIn: PropTypes.func.isRequired,
    onSignOut: PropTypes.func.isRequired
};

export default GoogleDriveAuthButton;
