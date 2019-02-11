import "./shim.js";
import React, { Component, Fragment } from "react";
import { AppRegistry, BackHandler } from "react-native";
import { Provider } from "react-redux";
import DropdownAlert from "react-native-dropdownalert";
import { getSharedArchiveManager } from "./source/library/buttercup.js";
import store from "./source/store.js";
import App from "./source/autofill/routing.js";
import { setNotificationFunction } from "./source/global/notify.js";
import { patchCrypto } from "./source/library/crypto";
import { backToRoot, navigateBackIfPossible } from "./source/shared/nav";
import { resetAppState } from "./source/shared/app";

export default class ButtercupAutoFill extends Component {
    constructor(...args) {
        super(...args);

        // React Native mixes the state between AutoFill and the main app.
        // The AutoFill routes do not include most of the App routes, which may throw a fatal
        //  error if the AutoFill app loads while the regular app is in background on a (missing) route

        // The simplest thing to do here is force the nav state back to the root so that the
        //  user can't possibly be on a missing route
        backToRoot();

        // Setup native crypto
        patchCrypto();

        // Initialise the manager
        getSharedArchiveManager().rehydrate();

        // Setup notifications
        setNotificationFunction((type, title, message) => {
            if (this.dropdown) {
                this.dropdown.alertWithType(type, title, message);
            }
        });

        // Android specific launch code
        this.prepareBackButtonHandlers();
    }

    prepareBackButtonHandlers() {
        let timer = null;
        // Listen for the hardware back button
        BackHandler.addEventListener("hardwareBackPress", () => {
            if (timer === null) {
                const willGoBack = navigateBackIfPossible();
                if (willGoBack) {
                    // We'll navigate back, so debounce this function
                    timer = setTimeout(() => {
                        timer = null;
                    }, 400);
                } else {
                    // wipe our state
                    resetAppState();
                    return false; // not handled, let the device do its thing
                }
            }
            return true; // handled
        });
    }

    render() {
        return (
            <Provider store={store}>
                <Fragment>
                    <App screenProps={this.props} />
                    <DropdownAlert ref={ref => (this.dropdown = ref)} closeInterval={8000} />
                </Fragment>
            </Provider>
        );
    }
}

AppRegistry.registerComponent("ButtercupAutoFill", () => ButtercupAutoFill);
