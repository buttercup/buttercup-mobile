import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { StackNavigator } from "react-navigation";

import AutoFillList from "../containers/AutoFillList.js";

export default (AppNavigator = StackNavigator(
    {
        AutoFillListPage: { screen: AutoFillList }
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
));
