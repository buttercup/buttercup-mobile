import React, { Component } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Cell } from "react-native-cell-components";
import PropTypes from "prop-types";
import { getNameForSource } from "../shared/entries";
import { getEntry, getEntryPath } from "../shared/entry";

const ENTRY_ICON = require("../../resources/images/entry-256.png");

const styles = StyleSheet.create({
    icon: {
        width: 32,
        height: 32,
        marginRight: 8
    },
    entryUsername: {
        fontSize: 12
    },
    entrySubtitle: {
        color: "#777",
        fontSize: 12
    }
});

class SearchResult extends Component {
    static propTypes = {
        sourceID: PropTypes.string.isRequired,
        entryID: PropTypes.string.isRequired,
        onEntryPress: PropTypes.func.isRequired,
        icon: PropTypes.element
    };

    getEntryIcon() {
        return <Image source={ENTRY_ICON} style={styles.icon} />;
    }

    render() {
        const entry = getEntry(this.props.sourceID, this.props.entryID);
        return (
            <Cell
                icon={this.getEntryIcon}
                onPress={() => this.props.onEntryPress(this.props.entryID, this.props.sourceID)}
            >
                <View>
                    <Text>{entry.getProperty("title") || ""}</Text>
                    <Text style={styles.entryUsername}>{entry.getProperty("username") || ""}</Text>
                    <Text style={styles.entrySubtitle}>
                        {getNameForSource(this.props.sourceID)} ›{" "}
                        <For
                            each="group"
                            index="index"
                            of={getEntryPath(this.props.sourceID, this.props.entryID)}
                        >
                            <If condition={index > 0}> › </If>
                            {group}
                        </For>
                    </Text>
                </View>
                {this.props.icon}
            </Cell>
        );
    }
}

export default SearchResult;
