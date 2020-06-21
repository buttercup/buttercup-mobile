import "react-native-gesture-handler";
import "./shim.js";
import React, { Component, Fragment } from "react";
import { AppRegistry, View, YellowBox, StatusBar } from "react-native";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import DropdownAlert from "react-native-dropdownalert";
import { initButtercupCore } from "./source/compat/appEnv.js";
import { getSharedArchiveManager } from "./source/library/buttercup.js";
import store from "./source/store.js";
import ButtercupApp from "./source/routing.js";
import AutoFillApp from "./source/autofill/routing.js";
import { setNotificationFunction } from "./source/global/notify.js";
import { registerAuthWatchers } from "./source/library/auth.js";
import { setTopLevelNavigator } from "./source/shared/nav.js";
import i18n from "./source/shared/i18n";

// Ignore some warnings
// @TODO: remove this once we are fully upgraded
YellowBox.ignoreWarnings(["Warning: componentWill"]);

export default class ButtercupShared extends Component {
    constructor(...args) {
        super(...args);
        // Setup native compatibility patches
        initButtercupCore();
        // Initialise the manager
        getSharedArchiveManager().rehydrate();
        // Setup notifications
        setNotificationFunction((type, title, message, timeOverride = null) => {
            if (this.dropdown) {
                console.log(type, title);
                if (timeOverride && timeOverride > 0) {
                    this.dropdown.alertWithType(type, title, message, undefined, timeOverride);
                } else {
                    this.dropdown.alertWithType(type, title, message);
                }
            }
        });
        // Watch for auth failures and handle refreshing of tokens
        registerAuthWatchers();
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" />
                <Provider store={store}>
                    <I18nextProvider i18n={i18n}>
                        {/* Show the main app stack when NOT in autofill mode */}
                        {!this.props.isContextAutoFill && (
                            <ButtercupApp ref={navigator => setTopLevelNavigator(navigator)} />
                        )}
                        {/* Show the AutoFill app stack when IN autofill mode */}
                        {!!this.props.isContextAutoFill && (
                            <AutoFillApp
                                screenProps={this.props}
                                ref={navigator => setTopLevelNavigator(navigator)}
                            />
                        )}
                    </I18nextProvider>
                </Provider>
                <DropdownAlert
                    ref={ref => (this.dropdown = ref)}
                    closeInterval={8000}
                    activeStatusBarStyle="light-content"
                    inactiveStatusBarStyle="dark-content"
                />
            </View>
        );
    }
}

AppRegistry.registerComponent("Buttercup", () => ButtercupShared);
