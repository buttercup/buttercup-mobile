import React, { Component } from "react";
import { Button, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import { Cell, CellGroup, CellInput } from "react-native-cell-components";
import { FIELD_VALUE_TYPE_TEXT } from "@buttercup/facades";
import { saveNewMeta } from "../shared/entry.js";
import { FIELD_TYPE_OPTIONS } from "../library/buttercup.js";

const styles = StyleSheet.create({
    container: {
        width: "100%"
    }
});

class AddMetaPage extends Component {
    static navigationOptions = {
        title: "Add Property",
        headerRight: <Button title="Save" onPress={saveNewMeta} />
    };

    componentDidMount() {
        const initialKey = this.props.navigation.getParam("initialKey", "");
        const initialValue = this.props.navigation.getParam("initialValue", "");
        const initialValueType = this.props.navigation.getParam("initialValueType", null);
        this.props.setMetaValues(initialKey, initialValue);
        if (initialValueType) {
            this.props.setmetaValueType(initialValueType);
        }
    }

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
        const currentTypeField = FIELD_TYPE_OPTIONS.find(
            fieldOption =>
                (!this.props.metaValueType && fieldOption.type === FIELD_VALUE_TYPE_TEXT) ||
                fieldOption.type === this.props.metaValueType
        );
        return (
            <View style={styles.container}>
                <CellGroup>
                    <CellInput
                        key="key"
                        title="Name"
                        value={this.props.metaKey}
                        onChangeText={text => this.handleKeyChange(text)}
                        {...cellOptions}
                    />
                    <CellInput
                        key="value"
                        title="Value"
                        value={this.props.metaValue}
                        onChangeText={text => this.handleValueChange(text)}
                        {...cellOptions}
                        keyboardType={isUrl ? "url" : "default"}
                    />
                </CellGroup>
                <CellGroup>
                    <Cell
                        key="valueType"
                        title="Type"
                        value={currentTypeField.title}
                        icon="planet"
                        onPress={() => this.props.onChooseValueType()}
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
