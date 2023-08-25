import React from "react";
import { SafeAreaView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation, BottomNavigationTab, Divider, Icon } from "@ui-kitten/components";
import { AllCodesScreen } from "../screens/AllCodesScreen";
import { HomeScreen } from "../screens/HomeScreen";

const { Navigator, Screen } = createBottomTabNavigator();

const CodesIcon = props => <Icon {...props} name="keypad-outline" />;
const HomeIcon = props => <Icon {...props} name="home-outline" />;

function BottomTabBar({ navigation, state }) {
    return (
        <>
            <Divider />
            <BottomNavigation
                selectedIndex={state.index}
                onSelect={index => navigation.navigate(state.routeNames[index])}
            >
                <BottomNavigationTab title="HOME" icon={HomeIcon} />
                <BottomNavigationTab title="CODES" icon={CodesIcon} />
            </BottomNavigation>
        </>
    );
}

function TabNavigator() {
    return (
        <Navigator
            screenOptions={{ headerShown: false }}
            tabBar={props => <BottomTabBar {...props} />}
        >
            <Screen name="Home" component={HomeScreen} />
            <Screen name="Codes" component={AllCodesScreen} />
        </Navigator>
    );
}

export function HomeNavigator({ navigation }) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TabNavigator />
        </SafeAreaView>
    );
}
