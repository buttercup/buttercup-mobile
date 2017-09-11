import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";
import {
    List,
    ListItem
} from "react-native-elements";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "transparent"
    },
    menuList: {
        marginBottom: 20,
        width: "100%"
    }
});

const ARCHIVE_TYPES = [
    { type: "dropbox", title: "Dropbox", image: require("../../resources/images/dropbox-256.png") },
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
            <List style={styles.menuList}>
                {ARCHIVE_TYPES.map(({type, title, image}) =>
                    <ListItem
                        key={type}
                        title={title}
                        avatar={image}
                        onPress={() => this.handleTypeSelected(type, title)}
                        />
                )}
            </List>
        );
    }

    handleTypeSelected(type, title) {
        this.props.onArchiveSelected(type, title);
    }

    render() {
        return (
            <View style={styles.container}>
                {this.getMenuContents()}
            </View>
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
