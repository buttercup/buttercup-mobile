import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    View
} from "react-native";
import {
    StackNavigator,
    addNavigationHelpers
} from "react-navigation";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ArchivesPage from "./components/ArchivesPage.js";
import ArchiveContentsPage from "./containers/ArchiveContentsPage.js";
import EntryPage from "./containers/EntryPage.js";
import NewEntryPage from "./containers/NewEntryPage.js";
import AddMetaPage from "./containers/AddMetaPage.js";
import AddArchivePage from "./containers/AddArchivePage.js";
import RemoteConnectPage from "./containers/RemoteConnectPage.js";
import RemoteExplorerPage from "./containers/RemoteExplorerPage.js";
import PopupBrowser from "./containers/PopupBrowser.js";

export const AppNavigator = StackNavigator({
    Home: { screen: ArchivesPage },
    ArchiveContents: { screen: ArchiveContentsPage },
    Entry: { screen: EntryPage },
    NewEntry: { screen: NewEntryPage },
    AddMeta: { screen: AddMetaPage },
    AddArchive: { screen: AddArchivePage },
    RemoteConnect: { screen: RemoteConnectPage },
    RemoteExplorer: { screen: RemoteExplorerPage }
});

const AppWithNavigationState = ({ dispatch, nav }) => (
    <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
    dispatch:           PropTypes.func.isRequired,
    nav:                PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    nav:                state.nav
});

export default connect(mapStateToProps)(AppWithNavigationState);
