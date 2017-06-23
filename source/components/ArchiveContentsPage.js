import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";
import PropTypes from "prop-types";
import { Actions } from "react-native-router-flux";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "transparent",
        marginTop: 64
    }
});

class ArchiveContentsPage extends Component {

    constructor(...args) {
        super(...args);
        this.hasUpdatedTitle = false;
    }

    componentDidMount() {
        if (!this.hasUpdatedTitle && this.props.title && this.props.title.length > 0) {
            this.hasUpdatedTitle = true;
            Actions.refresh({ title: this.props.title });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {Object.values(this.props.groups).map(title =>
                    <Text key={title}>{title}</Text>
                )}
            </View>
        );
    }

}

ArchiveContentsPage.propTypes = {
    groups:             PropTypes.object.isRequired,
    title:              PropTypes.string.isRequired
};

// ArchiveContentsPage.defaultProps = {
//     stage:                      "chooseType"
// };

export default ArchiveContentsPage;
