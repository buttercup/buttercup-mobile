import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import ArchivesPage from "./components/ArchivesPage.js";
import SearchArchivesPage from "./containers/SearchArchivesPage.js";
import LockPage from "../components/LockPage";
// import {
//     createReactNavigationReduxMiddleware,
//     createReduxBoundAddListener
// } from "react-navigation-redux-helpers";
import PropTypes from "prop-types";
import { connect } from "react-redux";

export const AppNavigator = createStackNavigator(
    {
        Home: { screen: ArchivesPage },
        SearchArchives: { screen: SearchArchivesPage },
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

// const middleware = createReactNavigationReduxMiddleware("root", state => state.nav);
// const addListener = createReduxBoundAddListener("root");

// const AppWithNavigationState = ({ dispatch, nav, screenProps }) => (
//     <AppNavigator
//         screenProps={screenProps}
//         navigation={addNavigationHelpers({ dispatch, state: nav, addListener })}
//     />
// );

const AppWithNavigationState = createAppContainer(AppNavigator);

// AppWithNavigationState.propTypes = {
//     dispatch: PropTypes.func.isRequired,
//     nav: PropTypes.object.isRequired
// };

// const mapStateToProps = (state, ownProps) => ({
//     nav: state.nav,
//     screenProps: ownProps.screenProps
// });

// export default connect(mapStateToProps)(AppWithNavigationState);

export default AppWithNavigationState;
