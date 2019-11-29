import React, { Component } from "react";
import { Button, Image, Platform, StyleSheet, View } from "react-native";
import ArchivesList from "../../containers/ArchivesList.js";
import ToolbarIcon from "../../components/ToolbarIcon.js";
import { setSearchContext } from "../../actions/app.js";
import { dispatch } from "../../store.js";
import { setAutoFillIdentity, setAutoFillURLs, setIsContextAutoFill } from "../../actions/autofill";
import ToolbarButton from "../../components/ToolbarButton";
import { cancelAutoFill } from "../../shared/autofill";

const BUTTERCUP_LOGO = require("../../../resources/images/buttercup-header.png");
const SEARCH = require("../../../resources/images/search.png");

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
    return <ToolbarButton title={"Cancel"} onPress={cancelAutoFill} />;
}

class ArchivesPage extends Component {
    static navigationOptions = {
        headerRight: getRightToolbarButton(),
        headerTitle: getHeaderImage()
    };

    componentDidMount() {
        // Flag to the App that we are running in the AutoFill extension context
        dispatch(setIsContextAutoFill(!!this.props.screenProps.isContextAutoFill));

        // Parse incoming props from the Native AutoFill context
        if (this.props.screenProps.serviceIdentifiers !== undefined) {
            dispatch(setAutoFillURLs(this.props.screenProps.serviceIdentifiers));
        } else if (this.props.screenProps.credentialIdentity !== undefined) {
            /**
             * Note: This case should never happen, as the iOS credential store is sync'd 1-1 with Buttercup at runtime.
             * Leaving this here for if/when the use case arises that it needs to be handled, but I could not find a way to replicate it.
             *
             * At the time of writing, the passed credentialIdentity is NOT handled in the rest of the app.
             * For more info see https://developer.apple.com/documentation/authenticationservices/ascredentialproviderviewcontroller/2977553-prepareinterfacetoprovidecredent?language=objc
             *
             * @se1exin - 14/1/19.
             */
            dispatch(setAutoFillIdentity(this.props.screenProps.credentialIdentity));
        }
    }

    render() {
        // Note we pass screenProps down from React Navigation so that the isContextAutoFill flag can be used
        return (
            <View style={styles.container}>
                <ArchivesList screenProps={this.props.screenProps} />
            </View>
        );
    }
}

export default ArchivesPage;
