import React, { Component } from "react";
import {
    StyleSheet,
    View
} from "react-native";
import PropTypes from "prop-types";
import { Actions } from "react-native-router-flux";
import Notification from "react-native-notification";
import {
    Cell,
    CellGroup,
    CellInput,
    // TagsInput,
    // SelectList,
    // CellSheet,
    // ActionItem,
    // CellDatePicker,
    // CellListProvider,
    // CellListItem,
    // CellSlider
} from "react-native-cell-components";

const styles = StyleSheet.create({
    container: {
        marginTop: 64,
        width: "100%"
    }
});

function displayValueForProp(propName, value) {
    switch(propName) {
        case "password":
            return "••••••••••";
        default:
            return value;
    }
}

function iconLabelForProp(propName) {
    switch(propName.toLowerCase()) {
        case "username":
            return "face";
        case "password":
            return "fingerprint";
        case "title":
            return "layers";
        case "url":
            return "laptop";
        default:
            return "label";
    }
}

class EntryPage extends Component {

    constructor(...args) {
        super(...args);
        this.hasUpdatedTitle = false;
    }

    componentDidMount() {
        if (!this.hasUpdatedTitle && this.props.title && this.props.title.length > 0) {
            this.hasUpdatedTitle = true;
            Actions.refresh({ title: this.props.title });
        }
    }

    handleCellPress(key, value) {
        this.props.copyToClipboard(key, value);
    }

    render() {
        return (
            <View style={styles.container}>
                <CellGroup header="Properties">
                    {this.props.properties.map(field =>
                        <Cell
                            key={field.property}
                            title={field.title}
                            value={displayValueForProp(field.property, field.value)}
                            icon={iconLabelForProp(field.property)}
                            onPress={() => this.handleCellPress(field.title, field.value)}
                            />
                    )}
                </CellGroup>
                <CellGroup header="Meta">
                    {this.props.meta.map(field =>
                        <Cell
                            key={field.property}
                            title={field.title}
                            value={displayValueForProp(field.property, field.value)}
                            icon={iconLabelForProp(field.property)}
                            onPress={() => this.handleCellPress(field.title, field.value)}
                            />
                    )}
                    {/*<Cell
                        key="$add"
                        title="＋ Add"
                        onPress={() => this.props.onAddMeta()}
                        tintColor="#1144FF"
                        />*/}
                </CellGroup>
                <Notification
                    message={this.props.entryNotificationMessage}
                    />
            </View>
        );
    }

}

EntryPage.propTypes = {
    copyToClipboard:        PropTypes.func.isRequired,
    meta:                   PropTypes.arrayOf(PropTypes.object).isRequired,
    onAddMeta:              PropTypes.func.isRequired,
    properties:             PropTypes.arrayOf(PropTypes.object).isRequired,
    title:                  PropTypes.string.isRequired
};

export default EntryPage;
