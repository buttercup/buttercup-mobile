import React, { Component } from "react";
import {
    Button,
    Image,
    StyleSheet,
    View
} from "react-native";
import ArchivesList from "../containers/ArchivesList.js";
import { showArchivesPageRightSheet } from "../shared/sheets.js";

const BUTTERCUP_LOGO = require("../../resources/images/buttercup-header.png");

const styles = StyleSheet.create({
    container: {
        width: "100%"
    }
});

class ArchivesPage extends Component {

    static navigationOptions = {
        headerTitle: (
            <Image
                source={BUTTERCUP_LOGO}
                resizeMode="contain"
                />
        ),
        headerRight: (
            <Button
                title="🔐"
                onPress={showArchivesPageRightSheet}
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
