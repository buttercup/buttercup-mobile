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
import { Actions } from "react-native-router-flux";
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

    render() {
        return (
            <View>
                <List style={styles.archivesList}>
                    {this.props.archives.map(archive =>
                        <ListItem
                            key={archive.id}
                            title={archive.name}
                            avatar={{ uri: "https://placeholdit.imgix.net/~text?txtsize=33&txt=Face&w=128&h=128" }}
                            onPress={() => alert(`You selected "${archive.name}"`)}
                            />
                    )}
                </List>
            </View>
        );
    }

}

ArchivesList.propTypes = {
    archives:           PropTypes.arrayOf(PropTypes.object)
};

export default ArchivesList;
