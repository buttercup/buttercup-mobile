import React, { Component } from "react";
import { Button, ScrollView, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import { Cell, CellGroup, CellInput } from "react-native-cell-components";
import { withNamespaces } from "react-i18next";
import Spinner from "./Spinner.js";
import ToolbarIcon from "./ToolbarIcon.js";

const NOOP = () => {};
const RIGHT_TITLE_OPEN = "Open";
const RIGHT_TITLE_SAVE = "Save";

const GLOBE_ICON = require("../../resources/images/globe.png");
const SAVE_ICON = require("../../resources/images/save.png");

const styles = StyleSheet.create({
    container: {
        width: "100%"
    }
});

function iconLabelForProp(propName) {
    switch (propName.toLowerCase()) {
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
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        const rightIcon = params.rightIcon || GLOBE_ICON;
        const onRight = params.rightAction || NOOP;
        return {
            title: `${params.title}`,
            headerRight: <ToolbarIcon icon={rightIcon} onPress={onRight} />
        };
    };

    static propTypes = {
        busyState: PropTypes.string,
        copyToClipboard: PropTypes.func.isRequired,
        editing: PropTypes.bool.isRequired,
        isReadOnly: PropTypes.bool.isRequired,
        onAddMeta: PropTypes.func.isRequired,
        onCancelEdit: PropTypes.func.isRequired,
        onCancelViewingHidden: PropTypes.func.isRequired,
        onDeletePressed: PropTypes.func.isRequired,
        onEditPressed: PropTypes.func.isRequired,
        onFieldValueChange: PropTypes.func.isRequired,
        onOpenPressed: PropTypes.func.isRequired,
        onSavePressed: PropTypes.func.isRequired,
        onViewHiddenPressed: PropTypes.func.isRequired,
        properties: PropTypes.arrayOf(PropTypes.object).isRequired,
        title: PropTypes.string.isRequired,
        viewHidden: PropTypes.bool.isRequired
    };

    componentDidMount() {
        this.updateRightButton();
    }

    componentWillReceiveProps(nextProps) {
        const editing = nextProps.editing;
        if (this.props.editing !== nextProps.editing) {
            this.updateRightButton(nextProps);
        }
        if (!editing && this.props.title !== this.props.navigation.state.params.title) {
            this.updateTitle(this.props.title);
        }
    }

    componentWillUnmount() {
        this.props.onCancelEdit();
        this.props.onCancelViewingHidden();
    }

    displayValueForProp(propName, value) {
        if (this.props.editing) {
            return value;
        }
        switch (propName) {
            case "password":
                return this.props.viewHidden ? value : "••••••••••";
            default:
                return value;
        }
    }

    filterFields(fields) {
        if (this.props.editing) {
            return fields;
        }
        return fields.filter(
            item =>
                item.field !== "property" ||
                (item.field === "property" && item.property !== "title")
        );
    }

    handleCellPress(key, value) {
        this.props.copyToClipboard(key, value);
    }

    modifyField(field, newValue) {
        this.props.onFieldValueChange(field.field, field.property, newValue);
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <CellGroup header="Properties">
                        <For each="field" of={this.filterFields(this.props.properties)}>
                            {this.renderContentCell(field)}
                        </For>
                        <If condition={this.props.editing}>
                            <Cell
                                key="$add"
                                title={this.props.t("entry.add")}
                                onPress={() => this.props.onAddMeta()}
                                tintColor="#1144FF"
                                icon={{ name: "tag-plus", source: "material-community-icons" }}
                            />
                        </If>
                    </CellGroup>
                    {this.renderEditButtons()}
                </ScrollView>
                <Spinner visible={this.props.busyState !== null} text={this.props.busyState} />
            </View>
        );
    }

    renderContentCell(field) {
        const { editing } = this.props;
        const cellOptions = editing
            ? {
                  autoCapitalize: "none",
                  autoCorrect: false,
                  keyboardType: "default",
                  spellCheck: false
              }
            : {};
        const CellType = editing ? CellInput : Cell;
        return (
            <CellType
                key={field.property}
                title={field.title}
                value={this.displayValueForProp(field.property, field.value)}
                icon={iconLabelForProp(field.property)}
                onPress={() => this.handleCellPress(field.title, field.value)}
                onChangeText={newText => this.modifyField(field, newText)}
                {...cellOptions}
            />
        );
    }

    renderEditButtons() {
        if (this.props.editing || this.props.viewHidden) {
            const onPressCallback = this.props.editing
                ? () => this.props.onCancelEdit()
                : () => this.props.onCancelViewingHidden();
            const buttonText = this.props.editing
                ? this.props.t("entry.cancel")
                : this.props.t("entry.hide-hidden");
            return (
                <CellGroup>
                    <Cell
                        key="cancel"
                        title={buttonText}
                        onPress={onPressCallback}
                        tintColor="#FF0000"
                        icon={{ name: "do-not-disturb", source: "material-community-icons" }}
                    />
                </CellGroup>
            );
        }
        return (
            <CellGroup>
                <Cell
                    key="view"
                    title="View hidden"
                    onPress={() => this.props.onViewHiddenPressed()}
                    tintColor="#1144FF"
                    icon={{ name: "eye", source: "material-community-icons" }}
                />
                <Cell
                    key="edit"
                    title="Edit"
                    onPress={() => this.props.onEditPressed()}
                    tintColor="#1144FF"
                    icon={{ name: "keyboard", source: "material-community-icons" }}
                    disabled={this.props.isReadOnly}
                />
                <Cell
                    key="delete"
                    title="Delete"
                    onPress={() => this.props.onDeletePressed()}
                    tintColor="#FF0000"
                    icon={{ name: "close", source: "material-community-icons" }}
                    disabled={this.props.isReadOnly}
                />
            </CellGroup>
        );
    }

    updateRightButton(props = this.props) {
        const rightIcon = props.editing ? SAVE_ICON : GLOBE_ICON;
        const rightAction = props.editing
            ? () => this.props.onSavePressed()
            : () => this.props.onOpenPressed();
        this.props.navigation.setParams({
            rightIcon,
            rightAction
        });
    }

    updateTitle(title) {
        this.props.navigation.setParams({
            title
        });
    }
}

export default withNamespaces()(EntryPage);
