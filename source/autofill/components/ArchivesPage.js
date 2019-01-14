import React, { Component } from "react";
import { Button, Image, Platform, StyleSheet, View } from "react-native";
import ArchivesList from "../../containers/ArchivesList.js";
import ToolbarIcon from "../../components/ToolbarIcon.js";
import { navigateToSearchArchives } from "../../actions/navigation.js";
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

function getLeftToolbarButton() {
    return <ToolbarIcon icon={SEARCH} onPress={gotoSearch} />;
}

function getRightToolbarButton() {
    return <ToolbarButton title={"Cancel"} onPress={cancelAutoFill} />;
}

function gotoSearch() {
    dispatch(setSearchContext("root"));
    dispatch(navigateToSearchArchives());
}

class ArchivesPage extends Component {
    static navigationOptions = {
        headerLeft: getLeftToolbarButton(),
        headerRight: getRightToolbarButton(),
        headerTitle: getHeaderImage()
    };

    componentDidMount() {
        // Flag to the App that we are running in the AutoFill extension context
        dispatch(setIsContextAutoFill(!!this.props.screenProps.isContextAutoFill));

        if (this.props.screenProps.serviceIdentifiers !== undefined) {
            dispatch(setAutoFillURLs(this.props.screenProps.serviceIdentifiers));
        } else if (this.props.screenProps.credentialIdentity !== undefined) {
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
