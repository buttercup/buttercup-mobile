import React, { Component } from "react";
import { Button, Image, Platform, StyleSheet, View } from "react-native";
import ArchivesList from "../containers/ArchivesList.js";
import { showArchivesPageRightSheet } from "../shared/sheets.js";
import ToolbarIcon from "./ToolbarIcon.js";

const BUTTERCUP_LOGO = require("../../resources/images/buttercup-header.png");
const CLOUD_ADD = require("../../resources/images/boxes-1.png");

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerImageAndroid: {
        alignSelf: "center",
        marginLeft: 38
    }
});

function getHeaderImage() {
    return Platform.select({
        ios: <Image source={BUTTERCUP_LOGO} resizeMode="contain" />,
        android: (
            <Image source={BUTTERCUP_LOGO} resizeMode="contain" style={styles.headerImageAndroid} />
        )
    });
}

function getRightToolbarButton() {
    return <ToolbarIcon icon={CLOUD_ADD} onPress={showArchivesPageRightSheet} />;
}

class ArchivesPage extends Component {
    static navigationOptions = {
        headerTitle: getHeaderImage(),
        headerRight: getRightToolbarButton()
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
