import React, { Component } from "react";
import { Button, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import { CellGroup, CellInput } from "react-native-cell-components";
import { saveNewMeta } from "../shared/entry.js";
import i18n from "../shared/i18n";

const styles = StyleSheet.create({
    container: {
        width: "100%"
    }
});

class AddMetaPage extends Component {
    static navigationOptions = {
        title: i18n.t("entry.property.add"),
        headerRight: <Button title={i18n.t("entry.property.save")} onPress={saveNewMeta} />
    };

    componentWillUnmount() {
        this.props.onUnmount();
    }

    handleKeyChange(key) {
        this.props.setMetaValues(key, this.props.metaValue);
    }

    handleValueChange(value) {
        this.props.setMetaValues(this.props.metaKey, value);
    }

    render() {
        const cellOptions = {
            autoCapitalize: "none",
            autoCorrect: false,
            keyboardType: "default",
            spellCheck: false
        };
        const isUrl = /url\b/i.test(this.props.metaKey);
        return (
            <View style={styles.container}>
                <CellGroup>
                    <CellInput
                        key="key"
                        title={i18n.t("entry.property.name")}
                        value={this.props.metaKey}
                        onChangeText={text => this.handleKeyChange(text)}
                        {...cellOptions}
                    />
                    <CellInput
                        key="value"
                        title={i18n.t("entry.property.value")}
                        value={this.props.metaValue}
                        onChangeText={text => this.handleValueChange(text)}
                        {...cellOptions}
                        keyboardType={isUrl ? "url" : "default"}
                    />
                </CellGroup>
            </View>
        );
    }
}

AddMetaPage.propTypes = {
    metaKey: PropTypes.string,
    metaValue: PropTypes.string,
    onUnmount: PropTypes.func,
    setMetaValues: PropTypes.func.isRequired
};

AddMetaPage.defaultProps = {
    metaKey: "",
    metaValue: "",
    onUnmount: () => {}
};

export default AddMetaPage;
