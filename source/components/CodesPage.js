import React, { Component } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemView: {
        flex: 1,
        flexDirection: "column",
        padding: 12,
        marginVertical: 8,
        marginHorizontal: 0,
        borderTopColor: "#DDD",
        borderTopWidth: 0.5,
        borderBottomColor: "#DDD",
        borderBottomWidth: 0.5,
        backgroundColor: "#FFF"
    },
    codeView: {
        flex: 1,
        flexDirection: "row"
    },
    description: {
        fontSize: 11
    },
    code: {
        fontSize: 30,
        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace"
    }
});

export default class CodesPage extends Component {
    static propTypes = {
        otpCodes: PropTypes.arrayOf(PropTypes.object).isRequired
    };

    renderCodeItem({ entryID, title, otpURL }) {
        return (
            <TouchableHighlight key={`${entryID}:${otpURL}`}>
                <View style={styles.itemView}>
                    <Text style={styles.description}>{title}</Text>
                    <View style={styles.codeView}>
                        <Text style={styles.code}>123 456</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.props.otpCodes.map(item => this.renderCodeItem(item))}
                    {/* {childGroups.map(group => (
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
                                <Text>{group.title}</Text>
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
                        ))} */}
                </ScrollView>
            </View>
        );
    }
}
