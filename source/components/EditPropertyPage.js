import React, { Component } from "react";
import { Button, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import { Cell, CellGroup, CellInput } from "react-native-cell-components";
import { FIELD_VALUE_TYPE_TEXT } from "@buttercup/facades";
import { saveEntryProperty } from "../shared/entry.js";
import { FIELD_TYPE_OPTIONS } from "../library/buttercup.js";

const CELL_OPTIONS = {
    autoCapitalize: "none",
    autoCorrect: false,
    keyboardType: "default",
    spellCheck: false
};

const styles = StyleSheet.create({
    container: {
        width: "100%"
    }
});

class EditPropertyPage extends Component {
    static navigationOptions = {
        title: "Edit Property",
        headerRight: <Button title="Save" onPress={saveEntryProperty} />
    };

    static propTypes = {
        fieldData: PropTypes.object.isRequired,
        onUnmount: PropTypes.func.isRequired
    };

    // componentDidMount() {
    //     const initialKey = this.props.navigation.getParam("initialKey", "");
    //     const initialValue = this.props.navigation.getParam("initialValue", "");
    //     const initialValueType = this.props.navigation.getParam("initialValueType", null);
    //     this.props.setMetaValues(initialKey, initialValue);
    //     if (initialValueType) {
    //         this.props.setmetaValueType(initialValueType);
    //     }
    // }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    // handleKeyChange(key) {
    //     this.props.setMetaValues(key, this.props.metaValue);
    // }

    // handleValueChange(value) {
    //     this.props.setMetaValues(this.props.metaKey, value);
    // }

    render() {
        // const isUrl = /url\b/i.test(this.props.metaKey);
        // const currentTypeField = FIELD_TYPE_OPTIONS.find(
        //     fieldOption =>
        //         (!this.props.metaValueType && fieldOption.type === FIELD_VALUE_TYPE_TEXT) ||
        //         fieldOption.type === this.props.metaValueType
        // );
        return (
            <View style={styles.container}>
                <CellGroup>
                    <CellInput
                        key="key"
                        title="Name"
                        value={this.props.fieldData.newProperty}
                        onChangeText={text => this.props.onEditProperty(text)}
                        {...CELL_OPTIONS}
                    />
                    <CellInput
                        key="value"
                        title="Value"
                        value={this.props.fieldData.newValue}
                        onChangeText={text => this.props.onEditValue(text)}
                        {...CELL_OPTIONS}
                        // keyboardType={isUrl ? "url" : "default"}
                    />
                </CellGroup>
                <CellGroup>
                    <Cell
                        key="valueType"
                        title="Type"
                        value={this.props.fieldData.newValueType}
                        icon="planet"
                        onPress={() => this.props.onChooseValueType()}
                    />
                </CellGroup>
            </View>
        );
    }
}

// EditPropertyPage.propTypes = {
//     metaKey: PropTypes.string,
//     metaValue: PropTypes.string,
//     onUnmount: PropTypes.func,
//     setMetaValues: PropTypes.func.isRequired
// };

// EditPropertyPage.defaultProps = {
//     metaKey: "",
//     metaValue: "",
//     onUnmount: () => {}
// };

export default EditPropertyPage;
