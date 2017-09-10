import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";
import PropTypes from "prop-types";
// import { Actions } from "react-native-router-flux";
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

    constructor(...args) {
        super(...args);
        this.hasUpdatedTitle = false;
    }

    componentDidMount() {
        if (!this.hasUpdatedTitle && this.props.title && this.props.title.length > 0) {
            this.hasUpdatedTitle = true;
            // Actions.refresh({ title: `📂 ${this.props.title}` });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <GroupsList groupID="0" />
            </View>
        );
    }

}

ArchiveContentsPage.propTypes = {
    title:              PropTypes.string.isRequired
};

export default ArchiveContentsPage;
