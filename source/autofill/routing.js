import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "react-navigation";

import ArchivesPage from "./components/ArchivesPage.js";
import SearchArchivesPage from "./containers/SearchArchivesPage.js";
import LockPage from "../components/LockPage";
import {
    reduxifyNavigator,
    createReactNavigationReduxMiddleware
} from "react-navigation-redux-helpers";
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

const middleware = createReactNavigationReduxMiddleware("root", state => state.nav);
const AppWithNavigationState = reduxifyNavigator(AppNavigator, "root");

AppWithNavigationState.propTypes = {
    dispatch: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
    state: state.nav,
    screenProps: ownProps.screenProps
});

export default connect(mapStateToProps)(AppWithNavigationState);
