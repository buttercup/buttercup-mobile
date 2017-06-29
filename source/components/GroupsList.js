import React, { Component } from "react";
import Accordion from "react-native-collapsible/Accordion";
import {
    StyleSheet,
    Text,
    View
} from "react-native";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
    accordionHeaderView: {
        height: 40,
        width: "100%"
    },
    accordionView: {
        width: "100%"
    }
});

function renderHeader(section) {
    const textStyle = {
        top: 13,
        left: 5 + (20 * this.level)
    };
    return (
        <View style={styles.accordionHeaderView}>
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
