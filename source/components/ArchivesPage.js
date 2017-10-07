import React, { Component } from "react";
import {
    Button,
    Image,
    StyleSheet,
    View
} from "react-native";
import ArchivesList from "../containers/ArchivesList.js";
import { showArchivesPageRightSheet } from "../shared/sheets.js";
import ToolbarIcon from "./ToolbarIcon.js";

const BUTTERCUP_LOGO = require("../../resources/images/buttercup-header.png");
const CLOUD_ADD = require("../../resources/images/boxes-1.png");

const styles = StyleSheet.create({
    container: {
        flex: 1
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
            <ToolbarIcon icon={CLOUD_ADD} onPress={showArchivesPageRightSheet} />
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
