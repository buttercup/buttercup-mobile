import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";
import PropTypes from "prop-types";
import GroupsList from "../containers/GroupsList.js";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "transparent"
    }
});

class ArchiveContentsPage extends Component {

    static navigationOptions = ({ navigation }) => {
        const {params = {}} = navigation.state;
        return {
            title: `${params.title}`,
        };
    };

    render() {
        return (
            <View style={styles.container}>
                <GroupsList groupID="0" />
            </View>
        );
    }

}

export default ArchiveContentsPage;
