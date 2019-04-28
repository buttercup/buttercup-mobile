import React, { Component } from "react";
import { Button, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import Prompt from "@perrymitchell/react-native-prompt";
import { Cell, CellGroup } from "react-native-cell-components";
import { withNamespaces } from "react-i18next";
import { editGroup } from "../shared/archiveContents.js";
import { rawGroupIsTrash } from "../shared/group.js";
import i18n from "../shared/i18n";
import Spinner from "./Spinner.js";
import EmptyView from "./EmptyView.js";
import ToolbarIcon from "./ToolbarIcon.js";

const ENTRY_ICON = require("../../resources/images/entry-256.png");
const GROUP_ICON = require("../../resources/images/group-256.png");
const TRASH_ICON = require("../../resources/images/trash-256.png");
const MENU_ICON = require("../../resources/images/menu.png");
const KEY_IMAGE = require("../../resources/images/key.png");

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    icon: {
        width: 32,
        height: 32
    }
});

function getEntryIcon() {
    return <Image source={ENTRY_ICON} style={styles.icon} />;
}

function getGroupIcon(group) {
    const icon = rawGroupIsTrash(group) ? TRASH_ICON : GROUP_ICON;
    return <Image source={icon} style={styles.icon} />;
}

class GroupsPage extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        const { groupID = "0", title, isTrash } = params;
        const options = { title: isTrash ? i18n.t("group.trash") : title };
        if (!isTrash) {
            options.headerRight = (
                <ToolbarIcon icon={MENU_ICON} onPress={() => editGroup(groupID)} />
            );
        }
        return options;
    };

    static propTypes = {
        busyState: PropTypes.string,
        currentGroupID: PropTypes.string.isRequired,
        onCancelGroupCreate: PropTypes.func.isRequired,
        onCancelGroupRename: PropTypes.func.isRequired,
        onEntryPress: PropTypes.func.isRequired,
        onGroupPress: PropTypes.func.isRequired,
        onGroupRename: PropTypes.func.isRequired,
        showGroupCreatePrompt: PropTypes.bool.isRequired,
        showGroupRenamePrompt: PropTypes.bool.isRequired
    };

    componentWillReceiveProps(newProps) {
        if (this.props.group && newProps.group) {
            if (this.props.group.title !== newProps.group.title) {
                this.props.navigation.setParams({ title: newProps.group.title });
            }
        }
    }

    render() {
        const isTrash = !!this.props.navigation.state.params.isTrash;
        const childGroups = (this.props.group && this.props.group.groups) || [];
        const childEntries = (this.props.group && this.props.group.entries) || [];
        return (
            <View style={styles.container}>
                <Choose>
                    <When condition={childGroups.length > 0 || childEntries.length > 0}>
                        <ScrollView>
                            <CellGroup>
                                {childGroups.map(group => (
                                    <Cell
                                        key={group.id}
                                        icon={() => getGroupIcon(group)}
                                        onPress={() =>
                                            this.props.onGroupPress(
                                                group.id,
                                                group.title,
                                                isTrash || rawGroupIsTrash(group)
                                            )
                                        }
                                    >
                                        <Text>
                                            {rawGroupIsTrash(group)
                                                ? this.props.t("group.trash")
                                                : group.title}
                                        </Text>
                                    </Cell>
                                ))}
                                {childEntries.map(entry => (
                                    <Cell
                                        key={entry.id}
                                        icon={getEntryIcon}
                                        onPress={() => this.props.onEntryPress(entry.id)}
                                    >
                                        <Text>{entry.properties.title || ""}</Text>
                                    </Cell>
                                ))}
                            </CellGroup>
                        </ScrollView>
                    </When>
                    <Otherwise>
                        <EmptyView
                            text={this.props.t("groups.add-a-group-or-entry")}
                            imageSource={KEY_IMAGE}
                        />
                    </Otherwise>
                </Choose>
                <Prompt
                    title={this.props.t("groups.rename-group")}
                    defaultValue={this.props.group.title}
                    visible={
                        this.props.showGroupRenamePrompt &&
                        this.props.group.id === this.props.currentGroupID
                    }
                    onCancel={() => this.props.onCancelGroupRename()}
                    onSubmit={value => this.props.onGroupRename(this.props.group.id, value)}
                    textInputProps={{ keyboardType: "default" }}
                />
                <Prompt
                    title={this.props.t("groups.create-group")}
                    placeholder={this.props.t("groups.group-name")}
                    visible={
                        this.props.showGroupCreatePrompt &&
                        this.props.group.id === this.props.currentGroupID
                    }
                    onCancel={() => this.props.onCancelGroupCreate()}
                    onSubmit={value => this.props.onGroupCreate(this.props.group.id, value)}
                    textInputProps={{ keyboardType: "default" }}
                />
                <Spinner visible={this.props.busyState !== null} text={this.props.busyState} />
            </View>
        );
    }
}

export default withNamespaces()(GroupsPage);
