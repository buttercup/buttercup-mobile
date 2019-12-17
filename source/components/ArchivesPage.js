import React, { Component } from "react";
import { Button, Image, Linking, Platform, StyleSheet, View } from "react-native";
import { withNamespaces } from "react-i18next";
import ArchivesList from "../containers/ArchivesList.js";
import { showArchivesPageRightSheet } from "../shared/sheets.js";
import ToolbarIcon from "./ToolbarIcon.js";
import { setPendingOTPURL, setSearchContext } from "../actions/app.js";
import { dispatch } from "../store.js";
import { executeNotification } from "../global/notify.js";
import { handleError } from "../global/exceptions.js";
import i18n from "../shared/i18n";

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

function getRightToolbarButton() {
    return <ToolbarIcon icon={CLOUD_ADD} onPress={showArchivesPageRightSheet} />;
}

function handleDeepLink(evt) {
    const url = typeof evt === "string" ? evt : evt.url;
    console.log("Received deep link URL:", url);
    dispatch(setPendingOTPURL(url));
    executeNotification(
        "success",
        i18n.t("codes.success.otp-detected.title"),
        i18n.t("codes.success.otp-detected.description"),
        15000
    );
}

class ArchivesPage extends Component {
    static navigationOptions = {
        headerRight: getRightToolbarButton(),
        headerTitle: getHeaderImage()
    };

    checkLinking() {
        Linking.getInitialURL()
            .then(url => {
                if (url) {
                    handleDeepLink(url);
                }
            })
            .catch(err => {
                handleError(this.props.t("codes.errors.otp-url-collection-failed"), err);
            });
    }

    componentDidMount() {
        this.checkLinking();
        Linking.addEventListener("url", handleDeepLink);
    }

    componentWillUnmount() {
        Linking.removeEventListener("url", handleDeepLink);
    }

    render() {
        return (
            <View style={styles.container}>
                <ArchivesList />
            </View>
        );
    }
}

export default withNamespaces()(ArchivesPage);
