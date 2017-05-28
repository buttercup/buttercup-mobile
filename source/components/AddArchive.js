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
// import { Actions } from "react-native-router-flux";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginTop: 64
    },
    menuList: {
        marginBottom: 20,
        width: "100%"
    }
});

const ARCHIVE_TYPES = [
    { type: "dropbox", title: "Dropbox" },
    { type: "owncloud", title: "ownCloud" },
    { type: "nextcloud", title: "Nextcloud" },
    { type: "webdav", title: "WebDAV" }
];

class AddArchive extends Component {

    getMenuContents() {

        return (
            <List style={styles.menuList}>
                {ARCHIVE_TYPES.map(({type, title}) =>
                    <ListItem
                        key={type}
                        title={title}
                        avatar={{ uri: `https://placeholdit.imgix.net/~text?txtsize=33&txt=${title}&w=128&h=128` }}
                        onPress={() => {}}
                        />
                )}
            </List>
        );
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
    stage:          PropTypes.string.isRequired
};

AddArchive.defaultProps = {
    stage:          "chooseType"
};

export default AddArchive;
