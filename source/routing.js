import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { StackNavigator, addNavigationHelpers } from "react-navigation";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// for react-navigation 1.0.0-beta.30
import {
    createReduxBoundAddListener,
    createReactNavigationReduxMiddleware
} from "react-navigation-redux-helpers";

import ArchivesPage from "./components/ArchivesPage.js";
import EntryPage from "./containers/EntryPage.js";
import NewEntryPage from "./containers/NewEntryPage.js";
import AddMetaPage from "./containers/AddMetaPage.js";
import AddArchivePage from "./containers/AddArchivePage.js";
import SearchArchivesPage from "./containers/SearchArchivesPage.js";
import RemoteConnectPage from "./containers/RemoteConnectPage.js";
import RemoteExplorerPage from "./containers/RemoteExplorerPage.js";
import PopupBrowser from "./containers/PopupBrowser.js";
import LockPage from "./components/LockPage.js";
import VaultNavigator from "./components/VaultNavigator.js";

export const AppNavigator = StackNavigator(
    {
        Home: { screen: ArchivesPage },
        Entry: { screen: EntryPage },
        NewEntry: { screen: NewEntryPage },
        AddMeta: { screen: AddMetaPage },
        AddArchive: { screen: AddArchivePage },
        SearchArchives: { screen: SearchArchivesPage },
        RemoteConnect: { screen: RemoteConnectPage },
        RemoteExplorer: { screen: RemoteExplorerPage },
        PopupBrowser: { screen: PopupBrowser },
        VaultContents: { screen: VaultNavigator },
        LockPage: { screen: LockPage }
    },
    {
        navigationOptions: {
            headerTintColor: "#454545",
            headerStyle: {
                backgroundColor: "#ffffff",
                borderBottomColor: "#24B5AB",
                borderBottomWidth: 3
            },
            headerTitleStyle: {
                flex: 1
            }
        }
    }
);

const middleware = createReactNavigationReduxMiddleware("root", state => state.nav);
const addListener = createReduxBoundAddListener("root");

const AppWithNavigationState = ({ dispatch, nav }) => (
    <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav, addListener })} />
);

AppWithNavigationState.propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    nav: state.nav
});

export default connect(mapStateToProps)(AppWithNavigationState);
