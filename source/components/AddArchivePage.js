import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image
} from "react-native";
import {
    Cell,
    CellGroup
} from "react-native-cell-components";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    icon: {
        width: 32,
        height: 32
    }
});

const ARCHIVE_TYPES = [
    // { type: "dropbox", title: "Dropbox", image: require("../../resources/images/dropbox-256.png") },
    { type: "owncloud", title: "ownCloud", image: require("../../resources/images/owncloud-256.png") },
    { type: "nextcloud", title: "Nextcloud", image: require("../../resources/images/nextcloud-256.png") },
    { type: "webdav", title: "WebDAV", image: require("../../resources/images/webdav-256.png") }
];

class AddArchive extends Component {

    static navigationOptions = {
        title: "Add Archive"
    };

    getMenuContents() {
        return (
            <CellGroup header="Remote">
                {ARCHIVE_TYPES.map(({type, title, image}) =>
                    <Cell
                        key={type}
                        icon={() => <Image source={image} style={styles.icon} />}
                        onPress={() => this.handleTypeSelected(type, title)}
                    >
                        <Text>{title}</Text>
                    </Cell>
                )}
            </CellGroup>
        );
    }

    handleTypeSelected(type, title) {
        this.props.onArchiveSelected(type, title);
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {this.getMenuContents()}
            </ScrollView>
        );
    }

}

AddArchive.propTypes = {
    onArchiveSelected:          PropTypes.func.isRequired,
    stage:                      PropTypes.string.isRequired
};

AddArchive.defaultProps = {
    stage:                      "chooseType"
};

export default AddArchive;
