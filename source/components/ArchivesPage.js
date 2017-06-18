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
import ArchivesList from "../containers/ArchivesList.js";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 64
    },
    listContainer: {
        width: "100%"
    }
});

class ArchivesPage extends Component {

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.listContainer}>
                    <ArchivesList />
                </View>
                <View style={styles.listContainer}>
                    <List>
                        <ListItem
                            key="add"
                            title="Add Archive"
                            avatar={{ uri: "https://placeholdit.imgix.net/~text?txtsize=33&txt=Face&w=128&h=128" }}
                            onPress={Actions.addArchive}
                            />
                        <ListItem
                            key="settings"
                            title="Settings"
                            avatar={{ uri: "https://placeholdit.imgix.net/~text?txtsize=33&txt=Face&w=128&h=128" }}
                            />
                    </List>
                </View>
            </View>
        );
    }

}

export default ArchivesPage;
