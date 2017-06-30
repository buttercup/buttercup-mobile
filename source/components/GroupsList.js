import React, { Component } from "react";
import Accordion from "react-native-collapsible/Accordion";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import PropTypes from "prop-types";
import { Button } from "react-native-elements";
import {
    Card,
    // CardImage,
    CardTitle,
    CardContent,
    CardAction
} from "react-native-card-view";

const ACCORDION_ITEM_HEIGHT = 48;
const ENTRY_ICON = require("../../resources/images/entry-256.png");
const GROUP_ICON = require("../../resources/images/group-256.png");
const ICON_SIZE = ACCORDION_ITEM_HEIGHT - 8;

const styles = StyleSheet.create({
    accordionHeaderView: {
        flex: 0,
        justifyContent: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        height: ACCORDION_ITEM_HEIGHT,
        width: "100%"
    }
});

function renderEntry(entry) {
    const {
        title
    } = entry.properties;
    const dict = [
        ["Username", entry.properties.username],
        ["Password", entry.properties.password],
        ...Object.keys(entry.meta || {}).map(key => [
            key, entry.meta[key]
        ])
    ];
    return (
        <Card style={{ width: "100%" }}>
            <CardContent style={{ width: "100%" }}>
                {dict.map(([key, value], index) =>
                    <View
                        key={key}
                        style={{
                            width: "100%",
                            height: 32,
                            marginTop: (index === 0 ? 0 : 10)
                        }}
                        >
                            <Text style={{ fontSize: 14, color: "#444" }}>{key}</Text>
                            <Text style={{ fontSize: 12 }}>{value}</Text>
                    </View>
                )}
            </CardContent>
            <CardAction>
                <Button
                    title="Edit"
                    icon={{ name: "create" }}
                    backgroundColor="rgb(0, 183, 172)"
                    />
                <Button
                    title="Copy"
                    icon={{ name: "assignment" }}
                    backgroundColor="rgb(0, 183, 172)"
                    />
            </CardAction>
        </Card>
    );
}

function renderHeader(section) {
    const imageLeft = 5 + (20 * this.level);
    const textLeft = imageLeft + 8;
    const textStyle = {
        flex: 1,
        marginLeft: 8
    };
    const imageStyle = {
        flex: 0,
        marginLeft: imageLeft,
        width: ICON_SIZE,
        height: ICON_SIZE
    }
    return (
        <View style={styles.accordionHeaderView}>
            <Image
                style={imageStyle}
                source={section.type === "group" ? GROUP_ICON : ENTRY_ICON}
                />
            <Text style={textStyle}>{section.title}</Text>
        </View>
    );
}

function renderSection(section) {
    const GroupsListContainer = require("../containers/GroupsList.js").default;
    return (
        <View style={{ width: "100%" }}>
            {section.type === "group" ?
                <GroupsListContainer
                    groups={section.content.groups}
                    entries={section.content.entries}
                    level={this.level + 1}
                    /> :
                renderEntry(section.content)
            }
        </View>
    );
}

class GroupsList extends Component {

    getSections() {
        return [
            ...this.props.groups.map(group => ({
                title: group.title,
                content: group,
                type: "group"
            })),
            ...this.props.entries.map(entry => ({
                title: entry.properties.title,
                content: entry,
                type: "entry"
            }))
        ];
    }

    render() {
        const { level } = this.props;
        const accordionStyles = { width: "100%" };
        if (level === 0) {
            accordionStyles.height = "100%";
        }
        const RootElement = (level === 0) ?
            ScrollView :
            View;
        return (
            <RootElement style={accordionStyles}>
                <Accordion
                    sections={this.getSections()}
                    renderHeader={renderHeader.bind({ level })}
                    renderContent={renderSection.bind({ level })}
                    />
            </RootElement>
        );
    }

}

GroupsList.propTypes = {
    groups:             PropTypes.arrayOf(PropTypes.object).isRequired,
    level:              PropTypes.number.isRequired
};

export default GroupsList;
