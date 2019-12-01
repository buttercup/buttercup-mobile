import React from "react";
import { Image, StyleSheet } from "react-native";
import { createTabNavigator } from "react-navigation-tabs";
import GroupsPage from "../containers/GroupsPage.js";
import CodesPage from "../containers/CodesPage.js";
import ToolbarIcon from "./ToolbarIcon.js";

const CODES = require("../../resources/images/pin-code.png");
const VAULT = require("../../resources/images/folder.png");

const styles = StyleSheet.create({
    image: {
        width: 20,
        height: 20
    }
});

export default createTabNavigator(
    {
        Vault: {
            screen: GroupsPage,
            navigationOptions: {
                tabBarIcon: <Image style={styles.image} source={VAULT} />
            }
        },
        Codes: {
            screen: CodesPage,
            navigationOptions: {
                tabBarIcon: <Image style={styles.image} source={CODES} />
            }
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
