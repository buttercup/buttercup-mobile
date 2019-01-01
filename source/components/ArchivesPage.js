import React, { Component } from "react";
import { Button, Image, Platform, StyleSheet, View } from "react-native";
import ArchivesList from "../containers/ArchivesList.js";
import { showArchivesPageRightSheet } from "../shared/sheets.js";
import ToolbarIcon from "./ToolbarIcon.js";
import { navigateToSearchArchives } from "../actions/navigation.js";
import { dispatch } from "../store.js";

const BUTTERCUP_LOGO = require("../../resources/images/buttercup-header.png");
const CLOUD_ADD = require("../../resources/images/boxes-1.png");
const SEARCH = require("../../resources/images/search.png");

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerImageAndroid: {
        alignSelf: "center",
        marginLeft: 20
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

function getLeftToolbarButton() {
    return <ToolbarIcon icon={SEARCH} onPress={gotoSearch} />;
}

function getRightToolbarButton() {
    return <ToolbarIcon icon={CLOUD_ADD} onPress={showArchivesPageRightSheet} />;
}

function gotoSearch() {
    dispatch(navigateToSearchArchives());
}

class ArchivesPage extends Component {
    static navigationOptions = {
        headerLeft: getLeftToolbarButton(),
        headerRight: getRightToolbarButton(),
        headerTitle: getHeaderImage()
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
