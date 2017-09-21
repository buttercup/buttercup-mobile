import React, { Component } from "react";
import {
    Button,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import PropTypes from "prop-types";
import {
    Cell,
    CellGroup
} from "react-native-cell-components";
import { editGroup } from "../shared/archiveContents.js";

const ARCHIVE_ENTRY_TRASH_ATTRIBUTE = "bc_group_role";
const ARCHIVE_ENTRY_TRASH_ROLE = "trash";
const ENTRY_ICON = require("../../resources/images/entry-256.png");
const GROUP_ICON = require("../../resources/images/group-256.png");

const styles = StyleSheet.create({
    container: {
        width: "100%"
    },
    icon: {
        width: 32,
        height: 32
    }
});

function getEntryIcon() {
    return (
        <Image
            source={ENTRY_ICON}
            style={styles.icon}
        />
    );
}

function getGroupIcon() {
    return (
        <Image
            source={GROUP_ICON}
            style={styles.icon}
        />
    );
}

function groupIsTrash(group) {
    return (group.attributes &&
        group.attributes[ARCHIVE_ENTRY_TRASH_ATTRIBUTE] === ARCHIVE_ENTRY_TRASH_ROLE);
}

class GroupsPage extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        const { groupID = "0", title, isTrash } = params;
        const options = {
            title: `${title}`
        };
        if (!isTrash) {
            options.headerRight = (
                <Button
                    title="Edit"
                    onPress={() => editGroup(groupID)}
                    />
            );
        }
        return options;
    };

    static propTypes = {
        onEntryPress: PropTypes.func.isRequired,
        onGroupPress: PropTypes.func.isRequired
    };

    render() {
        const isTrash = !!this.props.navigation.state.params.isTrash;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <CellGroup>
                        {this.props.group.groups.map(group =>
                            <Cell
                                key={group.id}
                                icon={getGroupIcon}
                                onPress={
                                    () => this.props.onGroupPress(
                                        group.id, group.title, isTrash || groupIsTrash(group)
                                    )
                                }
                            >
                                <Text>{group.title}</Text>
                            </Cell>
                        )}
                        {this.props.group.entries.map(entry =>
                            <Cell
                                key={entry.id}
                                icon={getEntryIcon}
                                onPress={() => this.props.onEntryPress(entry.id)}
                            >
                                <Text>{entry.properties.title || ""}</Text>
                            </Cell>
                        )}
                    </CellGroup>
                </ScrollView>
            </View>
        );
    }

}

export default GroupsPage;
