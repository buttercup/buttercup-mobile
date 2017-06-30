import React, { Component } from "react";
import Accordion from "react-native-collapsible/Accordion";
import {
    Image,
    StyleSheet,
    Text,
    View
} from "react-native";
import PropTypes from "prop-types";

const ACCORDION_ITEM_HEIGHT = 48;
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
    },
    accordionView: {
        width: "100%"
    }
});

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
            <Image style={imageStyle} source={GROUP_ICON} />
            <Text style={textStyle}>{section.title}</Text>
        </View>
    );
}

function renderSection(section) {
    const GroupsListContainer = require("../containers/GroupsList.js").default;
    return (
        <View>
            <GroupsListContainer
                groups={section.content.groups}
                level={this.level + 1}
                />
        </View>
    );
}

class GroupsList extends Component {

    getSections() {
        return this.props.groups.map(group => ({
            title: group.title,
            content: group
        }));
    }

    render() {
        // console.log("GROUPSLIST", this.props);
        const { level } = this.props;
        return (
            <View style={styles.accordionView}>
                <Accordion
                    sections={this.getSections()}
                    renderHeader={renderHeader.bind({ level })}
                    renderContent={renderSection.bind({ level })}
                    />
            </View>
        );
    }

}

GroupsList.propTypes = {
    groups:             PropTypes.arrayOf(PropTypes.object).isRequired,
    level:              PropTypes.number.isRequired
};

export default GroupsList;
