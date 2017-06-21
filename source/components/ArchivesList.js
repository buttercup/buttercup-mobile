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
        backgroundColor: "transparent",
        paddingTop: 30
    },
    archivesList: {
        marginBottom: 20,
        width: "100%"
    }
});

class ArchivesList extends Component {

    handleArchiveSelection(sourceID) {
        this.props.selectArchiveSource(sourceID);
        // Actions.archiveContents();
    }

    render() {
        return (
            <View>
                <List style={styles.archivesList}>
                    {this.props.archives.map(archive =>
                        <ListItem
                            key={archive.id}
                            title={archive.name}
                            avatar={{ uri: "https://placeholdit.imgix.net/~text?txtsize=33&txt=A&w=128&h=128" }}
                            onPress={() => this.handleArchiveSelection(archive.id)}
                            />
                    )}
                </List>
            </View>
        );
    }

}

ArchivesList.propTypes = {
    archives:               PropTypes.arrayOf(PropTypes.object),
    selectArchiveSource:    PropTypes.func.isRequired
};

export default ArchivesList;
