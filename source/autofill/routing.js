import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import ArchivesPage from "./components/ArchivesPage.js";
import SearchArchivesPage from "./containers/SearchArchivesPage.js";
import LockPage from "../components/LockPage";
import { ROOT_SCREEN, SEARCH_SCREEN, LOCK_SCREEN } from "../shared/nav.js";
import ToolbarButton from "../components/ToolbarButton.js";
import { cancelAutoFill } from "../shared/autofill.js";

function getRightToolbarButton() {
    return <ToolbarButton title={"Cancel"} onPress={cancelAutoFill} />;
}

export const AppNavigator = createStackNavigator(
    {
        [ROOT_SCREEN]: {
            screen: ArchivesPage
        },
        [SEARCH_SCREEN]: {
            screen: SearchArchivesPage,
            navigationOptions: {
                headerRight: getRightToolbarButton()
            }
        },
        [LOCK_SCREEN]: { screen: LockPage }
    },
    {
        defaultNavigationOptions: {
            headerTintColor: "#454545",
            headerStyle: {
                height: 55,
                backgroundColor: "#ffffff",
                borderBottomColor: "#24B5AB",
                borderBottomWidth: 3
            },
            headerForceInset: {
                top: "never"
            },
            headerTitleStyle: {
                flex: 1
            }
        },
        cardStyle: {
            backgroundColor: "#F8F8FD"
        }
    }
);

const AppWithNavigationState = createAppContainer(AppNavigator);

export default AppWithNavigationState;
