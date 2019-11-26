import React from "react";
import { Image, StyleSheet } from "react-native";
import { TabNavigator } from "react-navigation";
import GroupsPage from "../containers/GroupsPage.js";
import ToolbarIcon from "./ToolbarIcon.js";

import { Text, View } from "react-native";

const CODES = require("../../resources/images/pin-code.png");
const VAULT = require("../../resources/images/folder.png");

const styles = StyleSheet.create({
    image: {
        width: 20,
        height: 20
    }
});

class TestScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Test!</Text>
            </View>
        );
    }
}

export default TabNavigator(
    {
        Vault: {
            screen: GroupsPage,
            navigationOptions: {
                // title: "Vault",
                tabBarIcon: <Image style={styles.image} source={VAULT} />
            }
        },
        Codes: {
            screen: TestScreen,
            navigationOptions: {
                // title: "Vault",
                tabBarIcon: <Image style={styles.image} source={CODES} />
            }
        }
    },
    {
        // tabBarOptions: {
        //     iconStyle: {
        //         width: 30,
        //         height: 30
        //     }
        // }
    }
);
