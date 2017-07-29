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
import {
    EntryRouteNormalProps,
    EntryRouteSaveProps
} from "../shared/dynamicRoutes.js";

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
        this.lastTitle = "";
    }

    componentWillReceiveProps(props) {
        this.updateTitle(props);
    }

    componentDidMount() {
        this.updateTitle();
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
                    {this.props.editing ?
                        <Cell
                            key="$add"
                            title="＋ Add"
                            onPress={() => this.props.onAddMeta()}
                            tintColor="#1144FF"
                            /> :
                            null
                    }
                </CellGroup>
                {this.renderEditButtons()}
                <Notification
                    message={this.props.entryNotificationMessage}
                    />
            </View>
        );
    }

    renderEditButtons() {
        if (this.props.editing) {
            return (
                <CellGroup>
                    <Cell
                        key="cancel"
                        title="Cancel"
                        onPress={() => this.props.onCancelEdit()}
                        tintColor="#FF0000"
                        />
                </CellGroup>
            );
        }
        return (
            <CellGroup>
                <Cell
                    key="edit"
                    title="Edit"
                    onPress={() => this.props.onEditPressed()}
                    tintColor="#1144FF"
                    />
                <Cell
                    key="delete"
                    title="Delete"
                    onPress={() => {}}
                    tintColor="#FF0000"
                    />
            </CellGroup>
        );
    }

    updateTitle(props = this.props) {
        const title = props.editing ?
            `Edit: ${props.title}` :
            props.title;
        const navConfig = props.editing ?
            EntryRouteSaveProps :
            EntryRouteNormalProps;
        if (title !== this.lastTitle) {
            this.lastTitle = title;
            Actions.refresh({
                title,
                ...navConfig
            });
        }
    }

}

EntryPage.propTypes = {
    copyToClipboard:        PropTypes.func.isRequired,
    isEditMode:             PropTypes.bool,
    meta:                   PropTypes.arrayOf(PropTypes.object).isRequired,
    onAddMeta:              PropTypes.func.isRequired,
    onCancelEdit:           PropTypes.func.isRequired,
    onEditPressed:          PropTypes.func.isRequired,
    properties:             PropTypes.arrayOf(PropTypes.object).isRequired,
    title:                  PropTypes.string.isRequired
};

export default EntryPage;
