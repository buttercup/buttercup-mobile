import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import PropTypes from "prop-types";
import { Cell, CellGroup } from "react-native-cell-components";

class GoogleDriveAuthButton extends Component {
    beginAuthentication() {
        this.props.onClick();
    }

    render() {
        const title = this.props.authenticated ? "Authenticated" : "Authenticate";
        return (
            <CellGroup>
                <Cell
                    title={title}
                    icon={{ name: "google-drive", source: "entypo" }}
                    onPress={() => this.beginAuthentication()}
                    tintColor="#1144FF"
                    disabled={this.props.authenticating || this.props.authenticated}
                />
            </CellGroup>
        );
    }
}

GoogleDriveAuthButton.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authenticating: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

export default GoogleDriveAuthButton;
