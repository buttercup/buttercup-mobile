import React, { Component } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import PropTypes from "prop-types";
import { Cell, CellGroup } from "react-native-cell-components";
import i18n from "../shared/i18n";

const BUTTERCUP_ICON = require("../../resources/images/bcup-256.png");

const styles = StyleSheet.create({
    icon: {
        width: 32,
        height: 32
    }
});

class MyButtercupAuthButton extends Component {
    render() {
        const title = this.props.authenticated
            ? i18n.t("remote.authenticated")
            : i18n.t("remote.authenticate");
        return (
            <CellGroup>
                <Cell
                    title={title}
                    icon={() => <Image source={BUTTERCUP_ICON} style={styles.icon} />}
                    onPress={() => this.props.onSignIn()}
                    tintColor="#1144FF"
                    disabled={this.props.authenticating || this.props.authenticated}
                />
                {/* <Cell
                    title={i18n.t("remote.sign-out")}
                    icon={{ name: "log-out", source: "entypo" }}
                    onPress={() => this.props.onSignOut()}
                    tintColor="#1144FF"
                    disabled={!this.props.authenticated}
                /> */}
            </CellGroup>
        );
    }
}

MyButtercupAuthButton.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authenticating: PropTypes.bool.isRequired,
    onSignIn: PropTypes.func.isRequired
    // onSignOut: PropTypes.func.isRequired
};

export default MyButtercupAuthButton;
