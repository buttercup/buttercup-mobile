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
import { rawGroupIsTrash } from "../shared/group.js";

const ENTRY_ICON = require("../../resources/images/entry-256.png");
const GROUP_ICON = require("../../resources/images/group-256.png");
const TRASH_ICON = require("../../resources/images/trash-256.png");

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

function getGroupIcon(group) {
    const icon = rawGroupIsTrash(group) ?
        TRASH_ICON :
        GROUP_ICON;
    return (
        <Image
            source={icon}
            style={styles.icon}
        />
    );
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
                                icon={() => getGroupIcon(group)}
                                onPress={
                                    () => this.props.onGroupPress(
                                        group.id, group.title, isTrash || rawGroupIsTrash(group)
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
