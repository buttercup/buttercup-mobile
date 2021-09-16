import React from "react";
import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { withStyles } from "@ui-kitten/components";
import { AutofillHomeScreen } from "../../screens/autofill/AutofillHomeScreen";
import { AutofillItemsScreen } from "../../screens/autofill/AutofillItemsScreen";

const { Navigator, Screen } = createStackNavigator();

const HomeNavigator = () => (
    <Navigator headerMode="none">
        <Screen name="Home" component={AutofillHomeScreen} />
        <Screen name="Items" component={AutofillItemsScreen} />
    </Navigator>
);

const _ThemedSafeAreaView = ({ eva }) => (
    <SafeAreaView
        style={{
            flex: 0,
            backgroundColor: eva.theme["background-basic-color-1"]
        }}
    />
);
const ThemedSafeAreaView = withStyles(_ThemedSafeAreaView);

export function AppNavigator({ eva }) {
    return (
        <NavigationContainer>
            <ThemedSafeAreaView eva={eva} />
            <HomeNavigator />
            <ThemedSafeAreaView eva={eva} />
        </NavigationContainer>
    );
}
