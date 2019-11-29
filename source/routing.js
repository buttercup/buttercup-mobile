import React from "react";
import { StyleSheet, Image } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
// import { StackNavigator, addNavigationHelpers } from "react-navigation";

// for react-navigation 1.0.0-beta.30
// import {
//     createReduxBoundAddListener,
//     createReactNavigationReduxMiddleware
// } from "react-navigation-redux-helpers";

// import {
//     createReduxContainer,
//     createReactNavigationReduxMiddleware,
//     createNavigationReducer
// } from "react-navigation-redux-helpers";

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
import CodesPage from "./containers/CodesPage.js";
import GroupsPage from "./containers/GroupsPage.js";

const CODES = require("../resources/images/pin-code.png");
const VAULT = require("../resources/images/folder.png");

const styles = StyleSheet.create({
    image: {
        width: 20,
        height: 20
    }
});

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
        VaultContents: { screen: GroupsPage },
        LockPage: { screen: LockPage }
    },
    {
        defaultNavigationOptions: {
            headerTintColor: "#454545",
            headerStyle: {
                // backgroundColor: "#ffffff",
                borderBottomColor: "#24B5AB",
                borderBottomWidth: 3
            },
            headerTitleStyle: {
                flex: 1
            }
        }
    }
);

const CodesStack = createStackNavigator({
    CodesPage
});

const TabNavigator = createBottomTabNavigator(
    {
        Vaults: {
            screen: AppNavigator,
            navigationOptions: {
                tabBarIcon: <Image style={styles.image} source={VAULT} />
            }
        },
        Codes: {
            screen: CodesStack,
            navigationOptions: {
                tabBarIcon: <Image style={styles.image} source={CODES} />
            }
        },
        Search: {
            screen: SearchArchivesPage
        }
    },
    {
        tabBarOptions: {
            tabStyle: {
                color: "#000",
                backgroundColor: "#FFF"
            },
            labelStyle: {
                color: "#000"
            }
        }
    }
);

// const middleware = createReactNavigationReduxMiddleware(state => state.nav);
// const addListener = createReduxBoundAddListener("root");

// const AppWithNavigationState = ({ dispatch, nav }) => (
//     <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav, addListener })} />
// );

const App = createAppContainer(TabNavigator);
// const AppWithNavigationState = createReduxContainer(App);

// AppWithNavigationState.propTypes = {
//     dispatch: PropTypes.func.isRequired,
//     nav: PropTypes.object.isRequired
// };

// const mapStateToProps = state => ({
//     nav: state.nav
// });

// export default connect(mapStateToProps)(AppWithNavigationState);
export default App;
