import React, { Component } from "react";
import {
  StyleSheet,
  View
} from "react-native";
import ArchivesList from "../containers/ArchivesList.js";

const styles = StyleSheet.create({
    container: {
        marginTop: 64,
        width: "100%"
    }
});

class ArchivesPage extends Component {

    render() {
        return (
            <View style={styles.container}>
                <ArchivesList />
            </View>
        );
    }

}

export default ArchivesPage;
