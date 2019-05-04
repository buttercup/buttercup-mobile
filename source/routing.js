import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "react-navigation";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    reduxifyNavigator,
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
import GroupsPage from "./containers/GroupsPage.js";
import LockPage from "./components/LockPage.js";

export const AppNavigator = createStackNavigator(
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
        GroupsPage: { screen: GroupsPage },
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
const AppWithNavigationState = reduxifyNavigator(AppNavigator, "root");

AppWithNavigationState.propTypes = {
    dispatch: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    state: state.nav
});

export default connect(mapStateToProps)(AppWithNavigationState);
