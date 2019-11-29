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
import {
    VAULT_CONTENTS_SCREEN,
    ENTRY_SCREEN,
    ADD_VAULT_SCREEN,
    REMOTE_CONNECT_SCREEN,
    REMOTE_EXPLORER_SCREEN,
    ENTRY_NEW_META_SCREEN,
    ENTRY_NEW_SCREEN,
    LOCK_SCREEN,
    POPUP_BROWSER_SCREEN,
    ROOT_SCREEN
} from "./shared/nav.js";

const CODES = require("../resources/images/pin-code.png");
const VAULT = require("../resources/images/folder.png");

const styles = StyleSheet.create({
    image: {
        width: 20,
        height: 20
    }
});

const sharedStackStyles = {
    cardStyle: {
        backgroundColor: "#F8F8FD"
    }
};

export const AppNavigator = createStackNavigator(
    {
        [ROOT_SCREEN]: { screen: ArchivesPage },
        [ENTRY_SCREEN]: { screen: EntryPage },
        [ENTRY_NEW_SCREEN]: { screen: NewEntryPage },
        [ENTRY_NEW_META_SCREEN]: { screen: AddMetaPage },
        [ADD_VAULT_SCREEN]: { screen: AddArchivePage },
        [REMOTE_CONNECT_SCREEN]: { screen: RemoteConnectPage },
        [REMOTE_EXPLORER_SCREEN]: { screen: RemoteExplorerPage },
        [POPUP_BROWSER_SCREEN]: { screen: PopupBrowser },
        [VAULT_CONTENTS_SCREEN]: { screen: GroupsPage },
        [LOCK_SCREEN]: { screen: LockPage }
    },
    {
        defaultNavigationOptions: {
            headerTintColor: "#454545",
            headerStyle: {
                borderBottomColor: "#24B5AB",
                borderBottomWidth: 3
            },
            headerTitleStyle: {
                flex: 1
            }
        },
        ...sharedStackStyles
    }
);

const CodesStack = createStackNavigator(
    {
        CodesPage
    },
    {
        ...sharedStackStyles
    }
);

const SearchStack = createStackNavigator(
    {
        SearchArchivesPage
    },
    {
        ...sharedStackStyles
    }
);

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
            screen: SearchStack
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
