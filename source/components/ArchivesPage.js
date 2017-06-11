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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "transparent",
        paddingTop: 30
    },
    menuList: {
        marginBottom: 20,
        width: "100%"
    }
});

class ArchivesPage extends Component {

    render() {
        return (
            <View style={styles.container}>
                <List style={styles.menuList}>
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
        );
    }

}

export default ArchivesPage;
