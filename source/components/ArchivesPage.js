import React, { Component } from "react";
import {
    Image,
    StyleSheet,
    View
} from "react-native";
import ArchivesList from "../containers/ArchivesList.js";

const BUTTERCUP_LOGO = require("../../resources/images/buttercup-header.png");

const styles = StyleSheet.create({
    container: {
        width: "100%"
    }
});

class ArchivesPage extends Component {

    static navigationOptions = {
        // title: "Buttercup"
        headerTitle: (
            <Image
                source={BUTTERCUP_LOGO}
                resizeMode="contain"
                />
        )
    };

    render() {
        return (
            <View style={styles.container}>
                <ArchivesList />
            </View>
        );
    }

}

export default ArchivesPage;
