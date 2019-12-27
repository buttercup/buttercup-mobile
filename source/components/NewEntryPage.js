import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import { CellGroup, CellInput } from "@sallar/react-native-cell-components";
import { withNamespaces } from "react-i18next";
import i18n from "../shared/i18n";
import { saveNewEntry } from "../shared/entry.js";
import Spinner from "./Spinner.js";
import { HeaderButtons, Item } from "./HeaderButtons.js";

const styles = StyleSheet.create({
    container: {
        width: "100%"
    }
});

class NewEntryPage extends Component {
    static navigationOptions = {
        title: i18n.t("entry.new-entry"),
        headerRight: () => (
            <HeaderButtons>
                <Item title={i18n.t("entry.create")} onPress={saveNewEntry} />
            </HeaderButtons>
        )
    };

    componentWillUnmount() {
        this.props.onUnmount();
    }

    handleValueChange(key, value) {
        this.props.setPropertyValue(key, value);
    }

    render() {
        const boringProps = {
            autoCapitalize: "none",
            autoCorrect: false,
            spellCheck: false
        };
        return (
            <View style={styles.container}>
                <CellGroup>
                    <CellInput
                        key="title"
                        title={this.props.t("entry.title")}
                        value={this.props.title}
                        onChangeText={text => this.handleValueChange("title", text)}
                    />
                    <CellInput
                        key="username"
                        title={this.props.t("entry.username")}
                        value={this.props.username}
                        keyboardType="email-address"
                        onChangeText={text => this.handleValueChange("username", text)}
                        {...boringProps}
                    />
                    <CellInput
                        key="password"
                        title={this.props.t("entry.password")}
                        value={this.props.password}
                        onChangeText={text => this.handleValueChange("password", text)}
                        {...boringProps}
                    />
                </CellGroup>
                <Spinner visible={this.props.busyState !== null} text={this.props.busyState} />
            </View>
        );
    }
}

NewEntryPage.propTypes = {
    busyState: PropTypes.string,
    onUnmount: PropTypes.func,
    password: PropTypes.string.isRequired,
    setPropertyValue: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
};

NewEntryPage.defaultProps = {
    onUnmount: () => {}
};

export default withNamespaces()(NewEntryPage);
