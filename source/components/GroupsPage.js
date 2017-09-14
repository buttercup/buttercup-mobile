import React, { Component } from "react";
import {
    Button,
    Image,
    StyleSheet,
    Text,
    View
} from "react-native";
import PropTypes from "prop-types";
import {
    Cell,
    CellGroup
} from "react-native-cell-components";

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

class GroupsPage extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: `${params.title}`,
            headerRight: (
                <Button
                    title="Add"
                    onPress={() => {}}
                    />
            )
        };
    };

    static propTypes = {
        onEntryPress: PropTypes.func.isRequired,
        onGroupPress: PropTypes.func.isRequired
    };

    render() {
        return (
            <View style={styles.container}>
                <CellGroup>
                    {this.props.group.groups.map(group =>
                        <Cell
                            key={group.id}
                            icon={getGroupIcon}
                            onPress={() => this.props.onGroupPress(group.id, group.title)}
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
            </View>
        );
    }

}

export default GroupsPage;
